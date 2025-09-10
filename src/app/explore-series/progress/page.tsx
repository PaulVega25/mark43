'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SeriesProgress() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            const storiesParam = searchParams.get('stories') || ''
            const categoriesParam = searchParams.get('categories') || ''
            router.push(`/explore-series/completion?stories=${storiesParam}&categories=${categoriesParam}`)
          }, 1000)
          return 100
        }
        
        // Faster progress until 95%, then slow down
        if (prev < 95) {
          return Math.min(prev + 3, 95)  // Moderate increment, cap at 95
        } else if (prev < 100) {
          return prev + 1  // Slower increment for final 5%
        }
        return 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [router, searchParams])

  return (
    <div className="progressPage">
      <div className="progressContainer">
        <h1>Preparing Your Case Studies</h1>
        <p>Generating detailed reports...</p>
        
        <div className="progressNumber">
          {progress}%
        </div>
        
        {progress === 100 && (
          <div className="completionMessage">
            <h2>✓ Complete!</h2>
            <p>Loading your selected stories...</p>
          </div>
        )}
      </div>
      
      <button 
        className="goBackButton"
        onClick={() => router.push('/explore-series/form')}
      >
        Go Back
      </button>
    </div>
  )
}