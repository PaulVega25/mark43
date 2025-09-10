'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface EcosystemData {
  title: string
  description: string
}

interface CustomerSeriesData {
  title: string
  description: string
}

export default function ChoosePath() {
  const router = useRouter()
  const [ecosystemData, setEcosystemData] = useState<EcosystemData | null>(null)
  const [customerSeriesData, setCustomerSeriesData] = useState<CustomerSeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ecosystem, customerSeries] = await Promise.all([
          api.getEcosystem(),
          api.getCustomerSeries()
        ])
        setEcosystemData(ecosystem)
        setCustomerSeriesData(customerSeries)
      } catch (err) {
        setError('Failed to load data. Please make sure the JSON server is running.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="choosePath">
        <div className="loadingMessage">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="choosePath">
        <div className="errorMessage">{error}</div>
      </div>
    )
  }

  return (
    <div className="choosePath">
      <div className="pathCard">
        <h2>{ecosystemData?.title || 'Build your ecosystem'}</h2>
        <p>{ecosystemData?.description || 'Select from ...'}</p>
        <button 
          onClick={() => router.push('/build-ecosystem')}
          className="pathButton"
        >
          Get Started
        </button>
      </div>
      
      <div className="pathCard">
        <h2>{customerSeriesData?.title || 'Explore Customer Series'}</h2>
        <p>{customerSeriesData?.description || 'Select from ...'}</p>
        <button 
          onClick={() => router.push('/explore-series')}
          className="pathButton"
        >
          Explore
        </button>
      </div>
    </div>
  )
}