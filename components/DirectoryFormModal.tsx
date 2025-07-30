'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Dialog } from '@headlessui/react'
import { Directory, District, ServiceType } from '@/types'

interface Props {
  initialData?: Partial<Directory>
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
    serviceTypeId: initialData?.serviceTypeId ?? 0,
    nameOfOrganization: initialData?.nameOfOrganization ?? '',
    description: initialData?.description ?? '',
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
    location:
      initialData?.lat && initialData?.long
        ? `${initialData.lat},${initialData.long}`
        : '',
    otherServices: initialData?.otherServices ?? '',
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

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.location.includes(',')) {
      toast.error('Location must be in "lat,long" format')
      return
    }

    const [latRaw, longRaw] = form.location.split(',').map((s) => s.trim())
    const lat = Number(latRaw)
    const long = Number(longRaw)

    if (isNaN(lat) || isNaN(long)) {
      toast.error('Latitude and longitude must be valid numbers')
      return
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90')
      return
    }

    if (long < -180 || long > 180) {
      toast.error('Longitude must be between -180 and 180')
      return
    }

    setSaving(true)

    try {
      const payload = {
        ...form,
        lat,
        long,
      }

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
        toast.success(`Directory ${initialData?.id ? 'updated' : 'created'} successfully`)
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
        <Dialog.Title className="text-xl font-bold mb-4">
          {initialData ? 'Edit Directory' : 'Add Directory'}
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

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="col-span-2 border p-2 rounded"
          />

          <select name="category" value={form.category} onChange={handleChange} className="col-span-1 border p-2 rounded" required>
            <option value="GOVERNMENT">Government</option>
            <option value="NGO">NGO</option>
            <option value="PRIVATE">Private</option>
          </select>

          <select
            name="serviceTypeId"
            value={form.serviceTypeId}
            onChange={handleChange}
            required
            className="col-span-1 border p-2 rounded"
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            name="districtId"
            value={form.districtId}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            name="sectorId"
            value={form.sectorId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Sector</option>
            {sectors.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            name="cellId"
            value={form.cellId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Cell</option>
            {cells.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="villageId"
            value={form.villageId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Village</option>
            {villages.map((v: any) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="col-span-1 border p-2 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="col-span-1 border p-2 rounded"
          />

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location (lat,long)"
            value={form.location}
            onChange={handleChange}
            required
            className="col-span-2 border p-2 rounded"
          />

          <input
            type="text"
            name="otherServices"
            placeholder="Other services (optional)"
            value={form.otherServices}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          />

          <label className="col-span-1 flex items-center gap-2">
            <input
              type="checkbox"
              name="paid"
              checked={form.paid}
              onChange={handleChange}
            />
            Paid
          </label>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="col-span-1 border p-2 rounded"
          />

          <input
            type="number"
            name="estimatedAttendance"
            placeholder="Estimated Attendance"
            value={form.estimatedAttendance}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          />

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
