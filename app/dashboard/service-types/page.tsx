'use client'

import { useEffect, useState } from 'react'
import { ServiceType } from '@/types'
import ServiceTypeModal from '@/components/ServiceTypeModal'
import toast from 'react-hot-toast'
import { Button } from "@/components/ui/button"

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)

  const fetchServiceTypes = async () => {
    try {
      const res = await fetch('/api/service-types')
      const data = await res.json()
      if (res.ok) {
        setServiceTypes(data.types)
      } else {
        toast.error('Failed to load service types.')
      }
    } catch (err) {
      toast.error('Network error while fetching service types.')
    }
  }

  const handleAdd = () => {
    setSelectedServiceType(null)
    setModalOpen(true)
  }

  const handleEdit = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this service type?')
    if (!confirmed) return

    toast.loading('Deleting service type...', { id: 'delete' })

    try {
      const res = await fetch(`/api/service-types/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Service type deleted.', { id: 'delete' })
        fetchServiceTypes()
      } else {
        toast.error('Failed to delete service type.', { id: 'delete' })
      }
    } catch (err) {
      toast.error('Network error while deleting.', { id: 'delete' })
    }
  }

  const handleSaved = (saved: ServiceType) => {
    toast.success(`Service type ${selectedServiceType ? 'updated' : 'created'} successfully.`)
    fetchServiceTypes()
  }

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Types</h1>
        <Button onClick={handleAdd}>
          Add Directory
        </Button>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100 ">
          <tr>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceTypes.map((type) => (
            <tr key={type.id}>
              <td className="border px-2 py-1">{type.name}</td>
              <td className="border px-2 py-1 text-center space-x-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(String(type.id))}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ServiceTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaved}
        serviceType={selectedServiceType}
      />
    </div>
  )
}
