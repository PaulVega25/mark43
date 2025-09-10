'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface EcosystemData {
  title: string
  description: string
  categories: any[]
}

export default function BuildEcosystem() {
  const router = useRouter()
  const [data, setData] = useState<EcosystemData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ecosystem = await api.getEcosystem()
        setData(ecosystem)
      } catch (err) {
        console.error('Error fetching ecosystem data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="detailPage">
        <div className="loadingMessage">Loading...</div>
      </div>
    )
  }

  return (
    <div className="detailPage">
      <div className="detailContent">
        <div className="leftSection">
          <div className="pathNumber">1</div>
          <h1 className="detailTitle">{data?.title}</h1>
        </div>
        
        <div className="rightSection">
          <div className="imageContainer">
            <img 
              src="/placeholder-ecosystem.jpg" 
              alt="Build Ecosystem"
              className="detailImage"
            />
          </div>
          <p className="detailDescription">{data?.description}</p>
          <button 
            onClick={() => router.push('/build-ecosystem/categories')}
            className="continueButton"
          >
            View Categories
          </button>
        </div>
      </div>
    </div>
  )
}