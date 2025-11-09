'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import DirectoryFormModal from '@/components/DirectoryFormModal'
import { Directory, District, ServiceType, BeneficiaryType } from '@/types'
import { Button } from "@/components/ui/button"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function DirectoryPage() {
  const [directories, setDirectories] = useState<Directory[]>([])
  const [filtered, setFiltered] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Directory | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [userDistrictId, setUserDistrictId] = useState<number | null>(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchData()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const user = await res.json()
        setUserDistrictId(user.districtId)
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dirRes, svcRes, distRes, benfRes] = await Promise.all([
        fetch('/api/directories'),
        fetch('/api/service-types'),
        fetch('/api/districts'),
        fetch('/api/beneficiary-types'),
      ])

      const dirJson = await dirRes.json()
      const svcJson = await svcRes.json()
      const distJson = await distRes.json()
      const beneJson = await benfRes.json()

      setDirectories(dirJson.directories)
      setServiceTypes(svcJson.types)
      setDistricts(distJson)
      setBeneficiaryTypes(beneJson.types)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let results = [...directories]

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase()
      results = results.filter(dir =>
        dir.nameOfOrganization.toLowerCase().includes(query) ||
        dir.email.toLowerCase().includes(query) ||
        dir.phone.toLowerCase().includes(query)
      )
    }

    if (districtFilter) {
      results = results.filter(dir =>
        dir.locations?.some(loc => String(loc.district.id) === districtFilter)
      )
    }

    if (serviceTypeFilter) {
      results = results.filter(dir =>
        dir.services?.some((s) => String(s.service.id) === serviceTypeFilter)
      )
    }

    setFiltered(results)
  }, [directories, debouncedQuery, districtFilter, serviceTypeFilter])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/directories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Directory deleted')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete directory')
    }
  }

  const handleEdit = (dir: Directory) => {
    setSelected(dir)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelected(null)
    setShowModal(true)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Service Providers</h2>
        <div className="self-start sm:self-auto">
          <Button onClick={handleAdd}>Add a service provider</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          className="border px-3 py-2 rounded w-full sm:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded w-full sm:w-1/4"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts</option>
          {(userDistrictId 
            ? districts.filter(d => d.id === userDistrictId)
            : districts
          ).map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded w-full sm:w-1/4"
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
        >
          <option value="">All Service Types</option>
          {serviceTypes.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Services</th>
                <th className="text-left p-2">Beneficiaries</th>
                <th className="text-left p-2">District</th>
                <th className="text-left p-2">Full Address</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Website</th>
                <th className="text-left p-2">Paid</th>
                <th className="text-left p-2">Created By</th>
                {/* <th className="text-left p-2">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dir) => (
                <tr key={dir.id} className="border-t">
                  <td className="p-2">{dir.nameOfOrganization}</td>
                  <td className="p-2">{dir.category}</td>
                  <td className="p-2">
                    {dir.services
                      ?.map(s => s.service.name)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(', ')}
                  </td>
                  <td className="p-2">
                    {dir.beneficiaries
                      ?.map(b => b.beneficiary.name)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(', ')}
                  </td>
                  <td className="p-2">
                    {dir.locations
                      ?.map(loc =>
                        `${loc.district.name}`
                      )
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(' | ')}
                  </td>
                  <td className="p-2">
                    {dir.locations
                      ?.map(loc =>
                        `${loc.district.name}${loc.sector ? ` > ${loc.sector.name}` : ''}${loc.cell ? ` > ${loc.cell.name}` : ''}${loc.village ? ` > ${loc.village.name}` : ''}`
                      )
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(' | ')}
                  </td>
                  <td className="p-2">{dir.email}</td>
                  <td className="p-2">{dir.phone}</td>
                  <td className="p-2">{dir.website}</td>
                  <td className="p-2">{dir.paid ? 'PAID' : 'FREE'}</td>
                  <td className="p-2">{dir.createdBy?.name ?? '—'}</td>
                  {/* <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(dir)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(dir.id)} className="text-red-600 hover:underline">Delete</button>
                  </td> */}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">No directories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <DirectoryFormModal
          initialData={
            selected
              ? {
                  id: selected.id,
                  serviceTypeIds: selected.services?.map((s) => s.service.id) ?? [],
                  beneficiaryTypeIds: selected.beneficiaries?.map((b) => b.beneficiary.id) ?? [],
                  locations: selected.locations?.map(loc => ({
                    districtId: loc.districtId,
                    sectorId: loc.sectorId,
                    cellId: loc.cellId,
                    villageId: loc.villageId,
                  })),
                  nameOfOrganization: selected.nameOfOrganization,
                  category: selected.category,
                  email: selected.email,
                  phone: selected.phone,
                  website: selected.website ?? '',
                  paid: selected.paid,
                  otherServices: selected.otherServices ?? '',
                }
              : undefined
          }
          onClose={() => setShowModal(false)}
          onSaved={fetchData}
          serviceTypes={serviceTypes}
          beneficiaryTypes={beneficiaryTypes}
          districts={districts}
          modalOpen={showModal}
          userDistrictId={userDistrictId}
        />
      )}
    </div>
  )
}
