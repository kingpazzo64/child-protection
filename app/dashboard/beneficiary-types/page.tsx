'use client'

import { useEffect, useState } from 'react'
import { BeneficiaryType } from '@/types'
import BeneficiaryTypeModal from '@/components/BeneficiaryTypeModal'
import toast from 'react-hot-toast'
import { Button } from "@/components/ui/button"

export default function BeneficiaryTypesPage() {
  const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBeneficiaryType, setSelectedBeneficiaryType] = useState<BeneficiaryType | null>(null)

  const fetchBeneficiaryTypes = async () => {
    try {
      const res = await fetch('/api/beneficiary-types')
      const data = await res.json()
      if (res.ok) {
        setBeneficiaryTypes(data.types)
      } else {
        toast.error('Failed to load service types.')
      }
    } catch (err) {
      toast.error('Network error while fetching service types.')
    }
  }

  const handleAdd = () => {
    setSelectedBeneficiaryType(null)
    setModalOpen(true)
  }

  const handleEdit = (serviceType: BeneficiaryType) => {
    setSelectedBeneficiaryType(serviceType)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this beneficiary type?')
    if (!confirmed) return

    toast.loading('Deleting beneficiary type...', { id: 'delete' })

    try {
      const res = await fetch(`/api/beneficiary-types/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Beneficiary type deleted.', { id: 'delete' })
        fetchBeneficiaryTypes()
      } else {
        toast.error('Failed to delete beneficiary type.', { id: 'delete' })
      }
    } catch (err) {
      toast.error('Network error while deleting.', { id: 'delete' })
    }
  }

  const handleSaved = (saved: BeneficiaryType) => {
    toast.success(`Beneficiary type ${selectedBeneficiaryType ? 'updated' : 'created'} successfully.`)
    fetchBeneficiaryTypes()
  }

  useEffect(() => {
    fetchBeneficiaryTypes()
  }, [])

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Beneficiary Types</h1>
        <Button onClick={handleAdd}>
          Add Beneficiary Type
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
          {beneficiaryTypes.map((type) => (
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

      <BeneficiaryTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaved}
        beneficiaryType={selectedBeneficiaryType}
      />
    </div>
  )
}
