'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface Series {
  id: number
  category: string
  description?: string
  stories: any[]
}

interface CustomerSeriesData {
  title: string
  series: Series[]
}

export default function SeriesCategories() {
  const router = useRouter()
  const [data, setData] = useState<CustomerSeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerSeries = await api.getCustomerSeries()
        setData(customerSeries)
      } catch (err) {
        console.error('Error fetching series:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectCategory = (categoryId: number) => {
    setSelectedCategory(categoryId)
  }

  const handleNext = () => {
    if (selectedCategory) {
      router.push(`/explore-series/elements?categories=${selectedCategory}`)
    }
  }

  if (loading) {
    return (
      <div className="categoriesPage">
        <div className="loadingMessage">Loading...</div>
      </div>
    )
  }

  return (
    <div className="categoriesPage">
      <div className="categoriesHeader">
        <h1>{data?.title}</h1>
      </div>
      
      <div className="categoriesContainer">
        <div className="categoriesGrid">
          {data?.series.map((series) => (
            <div 
              key={series.id} 
              className={`categoryCard ${selectedCategory === series.id ? 'selected' : ''}`}
              onClick={() => selectCategory(series.id)}
            >
              <div className="categoryCardContent">
                <h3 className="categoryName">{series.category}</h3>
                {series.description && (
                  <p className="categoryDescription">{series.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="categoryActions">
          <button 
            onClick={() => router.push('/choose-path')}
            className="backButton"
          >
            Back to Paths
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!selectedCategory}
            className="nextButton"
          >
            Next {selectedCategory ? '(1 selected)' : ''}
          </button>
        </div>
      </div>
      
      <button 
        className="goBackButton"
        onClick={() => router.push('/choose-path')}
      >
        Go Back
      </button>
    </div>
  )
}