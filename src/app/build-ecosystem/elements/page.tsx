'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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

export default function EcosystemElements() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<EcosystemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNextToForm = () => {
    if (selectedItems.length > 0) {
      const selectedIds = selectedItems.join(',')
      const categoriesParam = searchParams.get('categories') || ''
      router.push(`/build-ecosystem/form?items=${selectedIds}&categories=${categoriesParam}`)
    }
  }

  const openDrawer = (item: Item) => {
    setSelectedItem(item)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedItem(null)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ecosystem = await api.getEcosystem()
        setData(ecosystem)
        
        const categoriesParam = searchParams.get('categories')
        if (categoriesParam && ecosystem) {
          const selectedIds = categoriesParam.split(',').map(id => parseInt(id))
          const selectedCategories = ecosystem.categories.filter(cat => selectedIds.includes(cat.id))
          const allItems = selectedCategories.flatMap(cat => cat.items)
          const categoryNames = selectedCategories.map(cat => cat.name)
          
          setFilteredItems(allItems)
          setSelectedCategoryNames(categoryNames)
        }
      } catch (err) {
        console.error('Error fetching elements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="elementsPage">
        <div className="loadingMessage">Loading...</div>
      </div>
    )
  }

  return (
    <div className="elementsPage">
      <div className="elementsHeader">
        <h1>Selected Items</h1>
        <p>From categories: {selectedCategoryNames.join(', ')}</p>
      </div>
      
      <div className="elementsContainer">
        <div className="elementsGrid">
          {filteredItems.map((item) => (
            <div key={item.id} className={`elementCard ${selectedItems.includes(item.id) ? 'selectedElement' : ''}`}>
              <div 
                className="elementCheckbox"
                onClick={() => toggleItemSelection(item.id)}
              >
                {selectedItems.includes(item.id) && <span>✓</span>}
              </div>
              <div className="elementCardContent">
                <h3 className="elementTitle">{item.title}</h3>
                <p className="elementDescription">{item.description}</p>
                <div className="elementPrice">${item.price}</div>
              </div>
              <button 
                onClick={() => openDrawer(item)}
                className="learnMoreButton"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
        
        <div className="elementsActions">
          <button 
            onClick={() => router.push('/build-ecosystem/categories')}
            className="backButton"
          >
            Back to Categories
          </button>
          
          <button 
            onClick={handleNextToForm}
            disabled={selectedItems.length === 0}
            className="nextButton"
          >
            Next ({selectedItems.length} selected)
          </button>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div className="drawerOverlay" onClick={closeDrawer}></div>
          <div className="drawer">
            <div className="drawerHeader">
              <h2>Item Details</h2>
              <button onClick={closeDrawer} className="closeButton">×</button>
            </div>
            <div className="drawerContent">
              {selectedItem && (
                <>
                  <h3 className="drawerTitle">{selectedItem.title}</h3>
                  <p className="drawerDescription">{selectedItem.description}</p>
                  <div className="drawerPrice">Price: ${selectedItem.price}</div>
                  <div className="drawerDetails">
                    <h4>Additional Information</h4>
                    <ul>
                      <li>Item ID: {selectedItem.id}</li>
                      <li>Category: Ecosystem Tools</li>
                      <li>Availability: In Stock</li>
                      <li>Support: 24/7 Technical Support</li>
                      <li>Updates: Regular feature updates included</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}