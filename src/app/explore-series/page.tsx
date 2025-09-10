'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface CustomerSeriesData {
  title: string
  description: string
  series: any[]
}

export default function ExploreSeries() {
  const router = useRouter()
  const [data, setData] = useState<CustomerSeriesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerSeries = await api.getCustomerSeries()
        setData(customerSeries)
      } catch (err) {
        console.error('Error fetching customer series data:', err)
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
          <div className="pathNumber">2</div>
          <h1 className="detailTitle">{data?.title}</h1>
        </div>
        
        <div className="rightSection">
          <div className="imageContainer">
            <img 
              src="/placeholder-series.jpg" 
              alt="Customer Series"
              className="detailImage"
            />
          </div>
          <p className="detailDescription">{data?.description}</p>
          <button 
            onClick={() => router.push('/explore-series/elements')}
            className="continueButton"
          >
            View Series
          </button>
        </div>
      </div>
    </div>
  )
}