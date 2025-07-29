'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { signIn } from "next-auth/react"

export default function ActivatePage() {
  const router = useRouter()
  const token = useSearchParams()?.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    const res = await fetch("/api/users/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      const { email } = await res.json()

      // Auto-login after activation
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (loginRes?.ok) {
        toast.success("Account activated successfully!")
        router.push("/dashboard")
      } else {
        toast.error("Account activated but login failed. Please log in manually.")
      }
    } else {
      const data = await res.json()
      toast.error(data.error || "Activation failed")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow text-black">
      <h2 className="text-xl font-bold mb-4">Activate Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Activating..." : "Activate"}
        </button>
      </form>
    </div>
  )
}
