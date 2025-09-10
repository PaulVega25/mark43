'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface Category {
  id: number
  name: string
  description?: string
  items: any[]
}

interface EcosystemData {
  title: string
  categories: Category[]
}

export default function EcosystemCategories() {
  const router = useRouter()
  const [data, setData] = useState<EcosystemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ecosystem = await api.getEcosystem()
        setData(ecosystem)
      } catch (err) {
        console.error('Error fetching categories:', err)
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
      router.push(`/build-ecosystem/elements?categories=${selectedCategory}`)
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
        <h1>{data?.title} - Categories</h1>
      </div>
      
      <div className="categoriesContainer">
        <div className="categoriesGrid">
          {data?.categories.map((category) => (
            <div 
              key={category.id} 
              className={`categoryCard ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => selectCategory(category.id)}
            >
              <div className="categoryCardContent">
                <h3 className="categoryName">{category.name}</h3>
                {category.description && (
                  <p className="categoryDescription">{category.description}</p>
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
    </div>
  )
}