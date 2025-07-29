'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { ServiceType } from '@/types'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (saved: ServiceType) => void
  serviceType?: ServiceType | null
}

export default function ServiceTypeModal({ open, onClose, onSave, serviceType }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const isEditing = !!serviceType

  useEffect(() => {
    if (serviceType) {
      setName(serviceType.name)
    } else {
      setName('')
    }
  }, [serviceType])

  const handleSubmit = async () => {
    setLoading(true)

    const method = isEditing ? 'PATCH' : 'POST'
    const url = isEditing
      ? `/api/service-types/${serviceType?.id}`
      : '/api/service-types'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (res.ok) {
      const data = await res.json()
      onSave(data)
      onClose()
    } else {
      alert('Something went wrong. Try again.')
    }

    setLoading(false)
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit Service Type' : 'Add Service Type'}
              </Dialog.Title>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Service type name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !name.trim()}
                  className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
