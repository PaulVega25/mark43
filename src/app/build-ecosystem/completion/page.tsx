'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/services/api'

interface Item {
  id: number
  title: string
  description: string
  price: number
}

interface Category {
  id: number
  name: string
  description?: string
  items: Item[]
}

interface EcosystemData {
  title: string
  categories: Category[]
}

export default function EcosystemCompletion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<EcosystemData | null>(null)
  const [categoryItems, setCategoryItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnlySelected, setShowOnlySelected] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ecosystem = await api.getEcosystem()
        setData(ecosystem)
        
        const itemsParam = searchParams.get('items')
        const categoryParam = searchParams.get('categories')
        
        if (itemsParam) {
          const selectedIds = itemsParam.split(',').map(id => parseInt(id))
          setSelectedItems(selectedIds)
        }
        
        if (categoryParam && ecosystem) {
          const categoryIds = categoryParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
          const selectedCategories = ecosystem.categories.filter(cat => categoryIds.includes(cat.id))
          const allItems = selectedCategories.flatMap(cat => cat.items)
          setCategoryItems(allItems)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  if (loading) {
    return (
      <div className="completionPage">
        <div className="loadingMessage">Loading...</div>
      </div>
    )
  }

  return (
    <div className="completionPage">
      <div className="circularContainer">
        <div className="circlePerimeter"></div>
        
        <div className="centerCircle">
          <div className="centerLogo">
            <div className="logoImage">
              <img src="/mark43-logo.png" alt="Mark43" className="logoImg" />
            </div>
            <div className="logoText">
              Mark43<br />CAD
            </div>
          </div>
        </div>
        
        <div className="elementsCircle">
          {(showOnlySelected ? categoryItems.filter(item => selectedItems.includes(item.id)) : categoryItems).map((item, index, filteredItems) => {
            const angle = (index * 360) / filteredItems.length
            const isSelected = selectedItems.includes(item.id)
            const radius = 599.21 / 2
            
            return (
              <div
                key={item.id}
                className={`circularElement ${isSelected ? 'highlighted' : 'dimmed'} ${showOnlySelected ? 'finalView' : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                }}
                onClick={() => {
                  if (!showOnlySelected) {
                    toggleItemSelection(item.id)
                  }
                }}
              >
                <div className="elementTitle">{item.title}</div>
                <div className="elementPrice">${item.price}</div>
              </div>
            )
          })}
        </div>
        
      </div>
      
      <button 
        className="nextButtonBottomRight"
        onClick={() => setShowOnlySelected(true)}
      >
        Next
      </button>
    </div>
  )
}