import dynamic from 'next/dynamic'

const ActivateClient = dynamic(() => import('./ActivateClient'), { ssr: false })

export default function ActivatePage() {
  return <ActivateClient />
}
