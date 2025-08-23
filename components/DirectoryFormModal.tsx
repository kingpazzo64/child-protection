'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Dialog } from '@headlessui/react'
import { Directory, District, ServiceType } from '@/types'
import { Button } from "@/components/ui/button"

interface Props {
  initialData?: Partial<Directory & { serviceTypeIds?: number[] }>
  onClose: () => void
  onSaved: () => void
  serviceTypes: ServiceType[]
  districts: District[]
  modalOpen: boolean
}

export default function DirectoryFormModal({
  initialData,
  onClose,
  onSaved,
  serviceTypes,
  districts,
  modalOpen,
}: Props) {
  const [form, setForm] = useState({
    serviceTypeIds: initialData?.serviceTypeIds ?? [], // ✅ multiple services
    nameOfOrganization: initialData?.nameOfOrganization ?? '',
    category: initialData?.category ?? '',
    districtId: initialData?.districtId ?? 0,
    sectorId: initialData?.sectorId ?? 0,
    cellId: initialData?.cellId ?? 0,
    villageId: initialData?.villageId ?? 0,
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    website: initialData?.website ?? '',
    paid: initialData?.paid ?? false,
    amount: initialData?.amount ?? 0,
    estimatedAttendance: initialData?.estimatedAttendance ?? 0,
    otherServices: initialData?.otherServices ?? '',
    urgency: initialData?.urgency ?? '',
  })

  const [sectors, setSectors] = useState([])
  const [cells, setCells] = useState([])
  const [villages, setVillages] = useState([])
  const [saving, setSaving] = useState(false)
  const [districtChanged, setDistrictChanged] = useState(false)
  const [sectorChanged, setSectorChanged] = useState(false)
  const [cellChanged, setCellChanged] = useState(false)

  // Prefill for edit mode
  useEffect(() => {
    if (form.districtId) {
      fetch(`/api/sectors/${form.districtId}`)
        .then((res) => res.json())
        .then(setSectors)

      if (districtChanged) {
        setForm((prev) => ({
          ...prev,
          sectorId: 0,
          cellId: 0,
          villageId: 0,
        }))
        setCells([])
        setVillages([])
      }
    } else {
      setSectors([])
    }
  }, [form.districtId])

  useEffect(() => {
    if (form.sectorId) {
      fetch(`/api/cells/${form.sectorId}`)
        .then((res) => res.json())
        .then(setCells)

      if (sectorChanged) {
        setForm((prev) => ({
          ...prev,
          cellId: 0,
          villageId: 0,
        }))
        setVillages([])
      }
    } else {
      setCells([])
    }
  }, [form.sectorId])

  useEffect(() => {
    if (form.cellId) {
      fetch(`/api/villages/${form.cellId}`)
        .then((res) => res.json())
        .then(setVillages)

      if (cellChanged) {
        setForm((prev) => ({
          ...prev,
          villageId: 0,
        }))
      }
    } else {
      setVillages([])
    }
  }, [form.cellId])

  useEffect(() => {
    if (modalOpen) {
      setDistrictChanged(false)
      setSectorChanged(false)
      setCellChanged(false)
    }
  }, [modalOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (name === 'districtId') setDistrictChanged(true)
    if (name === 'sectorId') setSectorChanged(true)
    if (name === 'cellId') setCellChanged(true)

    if (type === 'checkbox' && name === 'serviceTypeIds') {
      const id = Number(value)
      setForm((prev) => ({
        ...prev,
        serviceTypeIds: prev.serviceTypeIds.includes(id)
          ? prev.serviceTypeIds.filter((sid) => sid !== id)
          : [...prev.serviceTypeIds, id],
      }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = { ...form }

      const method = initialData?.id ? 'PATCH' : 'POST'
      const url = initialData?.id
        ? `/api/directories/${initialData.id}`
        : '/api/directories'

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
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={modalOpen} onClose={onClose} className="fixed z-50 inset-0 p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl mx-auto rounded-lg shadow p-6">
        <div className='text-right'>
          <Button onClick={onClose}>X</Button>
        </div>
        <Dialog.Title className="text-xl font-bold mb-4">
          {initialData ? 'Edit Service Provider' : 'Add Service Provider'}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nameOfOrganization"
            placeholder="Name of Organization"
            value={form.nameOfOrganization}
            onChange={handleChange}
            required
            className="col-span-2 border p-2 rounded"
          />

          <select name="category" value={form.category} onChange={handleChange} className="col-span-2 border p-2 rounded" required>
            <option value="">Select Category</option>
            <option value="GOVERNMENT">Government</option>
            <option value="NGO">NGO</option>
            <option value="COMMUNITY_BASED">Community Based</option>
          </select>

          {/* Multiple serviceType checkboxes */}
          <div className="col-span-2 border p-2 rounded">
            <label className="font-semibold mb-2 block">Services:</label>
            <div className="gap-2">
              {serviceTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="serviceTypeIds"
                    value={type.id}
                    checked={form.serviceTypeIds.includes(type.id)}
                    onChange={handleChange}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

          {/* Urgency / Beneficiaries */}
          <select
            name="urgency"
            value={form.urgency}
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            className="col-span-2 border p-2 rounded"
          >
            <option value="">Select Type of beneficiaries</option>
            <option value="VICTIMS_OF_ABUSE_EXPLOITATION">Victims of abuse and exploitation</option>
            <option value="STREET_CHILDREN">Street children</option>
            <option value="REFUGEE_CHILDREN">Children in refugees camps or transit centers</option>
            <option value="CHILDREN_WITH_DISABILITIES">Children with disabilities</option>
            <option value="EXTREME_POVERTY">Children with extreme poverty</option>
            <option value="SEPARATED_OR_ABANDONED">Children separated from their parents (or abandonned)</option>
            <option value="CHILDREN_IN_JUSTICE_SYSTEM">Children in the justice system</option>
            <option value="HARMFUL_PRACTICES">Children affected by harmful practices like early pregnancies</option>
          </select>

          {/* District / Sector / Cell / Village */}
          <select name="districtId" value={form.districtId} onChange={handleChange} required className="col-span-2 border p-2 rounded">
            <option value="">Select District</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select name="sectorId" value={form.sectorId} onChange={handleChange} className="col-span-2 border p-2 rounded">
            <option value="">Select Sector</option>
            {sectors.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="cellId" value={form.cellId} onChange={handleChange} className="col-span-2 border p-2 rounded">
            <option value="">Select Cell</option>
            {cells.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="villageId" value={form.villageId} onChange={handleChange} className="col-span-2 border p-2 rounded">
            <option value="">Select Village</option>
            {villages.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>

          {/* Contact & Other Info */}
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="col-span-2 border p-2 rounded" />
          <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="col-span-2 border p-2 rounded" />
          <input type="text" name="website" placeholder="Website" value={form.website} onChange={handleChange} className="col-span-2 border p-2 rounded" />
          <input type="text" name="otherServices" placeholder="Other services (optional)" value={form.otherServices} onChange={handleChange} className="col-span-2 border p-2 rounded" />

          <label>Amount Paid</label>
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="col-span-2 border p-2 rounded" />
          <label>Estimated Attendance</label>
          <input type="number" name="estimatedAttendance" placeholder="Estimated Attendance" value={form.estimatedAttendance} onChange={handleChange} className="col-span-2 border p-2 rounded" />

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button type="button" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
