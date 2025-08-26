'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Dialog } from '@headlessui/react'
import { Directory, District, ServiceType, BeneficiaryType, Sector, Cell, Village } from '@/types'
import { Button } from "@/components/ui/button"

interface Props {
  initialData?: {
    id?: number
    serviceTypeIds?: number[]
    beneficiaryTypeIds?: number[]
    locations?: { districtId: number; sectorId: number; cellId: number; villageId: number }[]
    nameOfOrganization?: string
    category?: string
    email?: string
    phone?: string
    website?: string
    paid?: boolean
    otherServices?: string
  }
  onClose: () => void
  onSaved: () => void
  serviceTypes: ServiceType[]
  beneficiaryTypes: BeneficiaryType[]
  districts: District[]
  modalOpen: boolean
}

type Location = {
  districtId: number
  sectorId: number
  cellId: number
  villageId: number
  sectors: Sector[]
  cells: Cell[]
  villages: Village[]
}

type FormState = {
  serviceTypeIds: number[]
  beneficiaryTypeIds: number[]
  nameOfOrganization: string
  category: string
  email: string
  phone: string
  website: string
  paid: boolean
  otherServices: string
}

export default function DirectoryFormModal({
  initialData,
  onClose,
  onSaved,
  serviceTypes,
  beneficiaryTypes,
  districts,
  modalOpen,
}: Props) {
  const [form, setForm] = useState<FormState>({
    serviceTypeIds: initialData?.serviceTypeIds ?? [],
    beneficiaryTypeIds: initialData?.beneficiaryTypeIds ?? [],
    nameOfOrganization: initialData?.nameOfOrganization ?? '',
    category: initialData?.category ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    website: initialData?.website ?? '',
    paid: initialData?.paid ?? false,
    otherServices: initialData?.otherServices ?? '',
  })

  const [locations, setLocations] = useState<Location[]>(() => {
    if (initialData?.locations?.length) {
      return initialData.locations.map((loc) => ({
        districtId: loc.districtId ?? 0,
        sectorId: loc.sectorId ?? 0,
        cellId: loc.cellId ?? 0,
        villageId: loc.villageId ?? 0,
        sectors: [],
        cells: [],
        villages: [],
      }))
    }
    return [{ districtId: 0, sectorId: 0, cellId: 0, villageId: 0, sectors: [], cells: [], villages: [] }]
  })

  const [saving, setSaving] = useState(false)

  // --- Preload dependent location data for existing locations ---
  const preloadLocations = async () => {
    if (!initialData?.locations) return

    const updatedLocations = await Promise.all(
      initialData.locations.map(async (loc) => {
        let sectors: Sector[] = []
        let cells: Cell[] = []
        let villages: Village[] = []

        if (loc.districtId) {
          const res = await fetch(`/api/sectors/${loc.districtId}`)
          sectors = await res.json()
        }
        if (loc.sectorId) {
          const res = await fetch(`/api/cells/${loc.sectorId}`)
          cells = await res.json()
        }
        if (loc.cellId) {
          const res = await fetch(`/api/villages/${loc.cellId}`)
          villages = await res.json()
        }

        return {
          districtId: loc.districtId,
          sectorId: loc.sectorId,
          cellId: loc.cellId,
          villageId: loc.villageId,
          sectors,
          cells,
          villages,
        }
      })
    )

    setLocations(updatedLocations)
  }

  useEffect(() => {
    if (modalOpen && initialData?.locations?.length) {
      preloadLocations()
    }
  }, [modalOpen, initialData])

  // --- Load dependent locations dynamically ---
  const loadSectors = async (index: number, districtId: number) => {
    if (!districtId) return
    const res = await fetch(`/api/sectors/${districtId}`)
    const data: Sector[] = await res.json()
    setLocations(prev => {
      const updated = [...prev]
      updated[index].sectors = data
      updated[index].sectorId = 0
      updated[index].cellId = 0
      updated[index].villageId = 0
      updated[index].cells = []
      updated[index].villages = []
      return updated
    })
  }

  const loadCells = async (index: number, sectorId: number) => {
    if (!sectorId) return
    const res = await fetch(`/api/cells/${sectorId}`)
    const data: Cell[] = await res.json()
    setLocations(prev => {
      const updated = [...prev]
      updated[index].cells = data
      updated[index].cellId = 0
      updated[index].villageId = 0
      updated[index].villages = []
      return updated
    })
  }

  const loadVillages = async (index: number, cellId: number) => {
    if (!cellId) return
    const res = await fetch(`/api/villages/${cellId}`)
    const data: Village[] = await res.json()
    setLocations(prev => {
      const updated = [...prev]
      updated[index].villages = data
      updated[index].villageId = 0
      return updated
    })
  }

  const handleLocationChange = (
    index: number,
    field: 'districtId' | 'sectorId' | 'cellId' | 'villageId',
    value: number
  ) => {
    setLocations(prev => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })

    if (field === 'districtId') loadSectors(index, value)
    if (field === 'sectorId') loadCells(index, value)
    if (field === 'cellId') loadVillages(index, value)
  }

  const addLocation = () => setLocations(prev => [...prev, { districtId: 0, sectorId: 0, cellId: 0, villageId: 0, sectors: [], cells: [], villages: [] }])
  const removeLocation = (index: number) => setLocations(prev => prev.filter((_, i) => i !== index))

  // --- Form change handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox' && name === 'serviceTypeIds') {
      const id = Number(value)
      setForm(prev => ({
        ...prev,
        serviceTypeIds: prev.serviceTypeIds.includes(id) ? prev.serviceTypeIds.filter(sid => sid !== id) : [...prev.serviceTypeIds, id],
      }))
    } else if (type === 'checkbox' && name === 'beneficiaryTypeIds') {
      const id = Number(value)
      setForm(prev => ({
        ...prev,
        beneficiaryTypeIds: prev.beneficiaryTypeIds.includes(id) ? prev.beneficiaryTypeIds.filter(bid => bid !== id) : [...prev.beneficiaryTypeIds, id],
      }))
    } else if (type === 'radio' && name === 'paid') {
      setForm(prev => ({ ...prev, paid: value === 'true' }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        locations: locations.map(l => ({
          districtId: l.districtId,
          sectorId: l.sectorId,
          cellId: l.cellId,
          villageId: l.villageId,
        })),
      }
      const method = initialData?.id ? 'PATCH' : 'POST'
      const url = initialData?.id ? `/api/directories/${initialData.id}` : '/api/directories'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success(`Service ${initialData?.id ? 'updated' : 'created'} successfully`)
        onSaved()
        onClose()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Something went wrong')
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={modalOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white max-w-2xl w-full rounded-lg shadow p-6 relative">
          <div className="text-right">
            <Button onClick={onClose}>X</Button>
          </div>
          <Dialog.Title className="text-xl font-bold mb-4">
            {initialData ? 'Edit Service Provider' : 'Add Service Provider'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Organization */}
            <input type="text" name="nameOfOrganization" placeholder="Name of Organization" value={form.nameOfOrganization} onChange={handleChange} required className="col-span-2 border p-2 rounded" />

            {/* Category */}
            <select name="category" value={form.category} onChange={handleChange} className="col-span-2 border p-2 rounded" required>
              <option value="">Select Category</option>
              <option value="GOVERNMENT">Government</option>
              <option value="NGO">NGO</option>
              <option value="COMMUNITY_BASED">Community Based</option>
            </select>

            {/* Services */}
            <div className="col-span-2 border p-2 rounded">
              <label className="font-semibold mb-2 block">Services:</label>
              <div className="gap-2">
                {serviceTypes.map(t => (
                  <label key={t.id} className="flex items-center gap-1">
                    <input type="checkbox" name="serviceTypeIds" value={t.id} checked={form.serviceTypeIds.includes(t.id)} onChange={handleChange} />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Beneficiaries */}
            <div className="col-span-2 border p-2 rounded">
              <label className="font-semibold mb-2 block">Beneficiaries:</label>
              <div className="gap-2">
                {beneficiaryTypes.map(b => (
                  <label key={b.id} className="flex items-center gap-1">
                    <input type="checkbox" name="beneficiaryTypeIds" value={b.id} checked={form.beneficiaryTypeIds.includes(b.id)} onChange={handleChange} />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Free / Paid */}
            <div className="col-span-2 border p-2 rounded">
              <label className="font-semibold mb-2 block">Payment:</label>
              <label className="flex items-center gap-2"><input type="radio" name="paid" value="false" checked={form.paid === false} onChange={handleChange} /> Free</label>
              <label className="flex items-center gap-2"><input type="radio" name="paid" value="true" checked={form.paid === true} onChange={handleChange} /> Paid</label>
            </div>

            {/* Locations */}
            <div className="col-span-2">
              {locations.map((loc, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span>Location {index + 1}</span>
                    {locations.length > 1 && <button type="button" onClick={() => removeLocation(index)}>Remove</button>}
                  </div>
                  <select value={loc.districtId} onChange={(e) => handleLocationChange(index, 'districtId', Number(e.target.value))} className="w-full mb-2 border p-2 rounded">
                    <option value={0}>Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={loc.sectorId} onChange={(e) => handleLocationChange(index, 'sectorId', Number(e.target.value))} className="w-full mb-2 border p-2 rounded">
                    <option value={0}>Select Sector</option>
                    {loc.sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <select value={loc.cellId} onChange={(e) => handleLocationChange(index, 'cellId', Number(e.target.value))} className="w-full mb-2 border p-2 rounded">
                    <option value={0}>Select Cell</option>
                    {loc.cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={loc.villageId} onChange={(e) => handleLocationChange(index, 'villageId', Number(e.target.value))} className="w-full mb-2 border p-2 rounded">
                    <option value={0}>Select Village</option>
                    {loc.villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              ))}
              <Button type="button" onClick={addLocation}>Add Location</Button>
            </div>

            {/* Contact */}
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="col-span-2 border p-2 rounded" />
            <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="col-span-2 border p-2 rounded" />
            <input type="text" name="website" placeholder="Website" value={form.website} onChange={handleChange} className="col-span-2 border p-2 rounded" />
            <input type="text" name="otherServices" placeholder="Other services (optional)" value={form.otherServices} onChange={handleChange} className="col-span-2 border p-2 rounded" />

            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button type="button" onClick={onClose} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  )
}
