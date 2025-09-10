'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/services/api'

interface Story {
  id: number
  company: string
  industry: string
  description: string
  caseStudyUrl: string
}

interface Series {
  id: number
  category: string
  description?: string
  stories: Story[]
}

interface CustomerSeriesData {
  title: string
  series: Series[]
}

export default function SeriesCompletion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<CustomerSeriesData | null>(null)
  const [categoryStories, setCategoryStories] = useState<Story[]>([])
  const [selectedStories, setSelectedStories] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnlySelected, setShowOnlySelected] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerSeries = await api.getCustomerSeries()
        setData(customerSeries)
        
        const storiesParam = searchParams.get('stories')
        const categoryParam = searchParams.get('categories')
        
        if (storiesParam) {
          const selectedIds = storiesParam.split(',').map(id => parseInt(id))
          setSelectedStories(selectedIds)
        }
        
        if (categoryParam && customerSeries) {
          const categoryIds = categoryParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
          const selectedSeries = customerSeries.series.filter(s => categoryIds.includes(s.id))
          const allStories = selectedSeries.flatMap(s => s.stories)
          setCategoryStories(allStories)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const toggleStorySelection = (storyId: number) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
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
          {(showOnlySelected ? categoryStories.filter(story => selectedStories.includes(story.id)) : categoryStories).map((story, index, filteredStories) => {
            const angle = (index * 360) / filteredStories.length
            const isSelected = selectedStories.includes(story.id)
            const radius = 599.21 / 2
            
            return (
              <div
                key={story.id}
                className={`circularElement ${isSelected ? 'highlighted' : 'dimmed'} ${showOnlySelected ? 'finalView' : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                }}
                onClick={() => {
                  if (!showOnlySelected) {
                    toggleStorySelection(story.id)
                  }
                }}
              >
                <div className="elementTitle">{story.company}</div>
                <div className="elementIndustry">{story.industry}</div>
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
      
      <button 
        className="goBackButton"
        onClick={() => router.push('/explore-series/progress')}
      >
        Go Back
      </button>
    </div>
  )
}