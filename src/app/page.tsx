
'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleChoosePath = () => {
    router.push('/choose-path')
  }

  return (
    <div className="homePage">
      <button 
        onClick={handleChoosePath}
        className="centerButton"
      >
        Get Started
      </button>
    </div>
  )
}
