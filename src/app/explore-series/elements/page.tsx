'use client'

import { useRouter } from 'next/navigation'

export default function SeriesElements() {
  const router = useRouter()

  return (
    <div className="mapPage">
      <div className="mapHeader">
        <h1>United States Customer Locations</h1>
        <p>Explore customer success stories across America</p>
      </div>
      
      <div className="mapContainer">
        <svg className="usMap" viewBox="0 0 1000 600">
          {/* Simplified US Map SVG */}
          <path 
            d="M 200 200 L 800 200 L 800 400 L 200 400 Z" 
            fill="#e5e7eb" 
            stroke="#9ca3af" 
            strokeWidth="2"
          />
          <text x="500" y="300" textAnchor="middle" className="mapText">
            United States Map
          </text>
          
          {/* Sample state markers */}
          <circle cx="300" cy="250" r="8" fill="#3b82f6" className="stateMarker" />
          <circle cx="450" cy="280" r="8" fill="#3b82f6" className="stateMarker" />
          <circle cx="600" cy="320" r="8" fill="#3b82f6" className="stateMarker" />
          <circle cx="700" cy="270" r="8" fill="#3b82f6" className="stateMarker" />
          <circle cx="350" cy="350" r="8" fill="#3b82f6" className="stateMarker" />
        </svg>
      </div>
      
      <button 
        className="goBackButton"
        onClick={() => router.push('/explore-series')}
      >
        Go Back
      </button>
    </div>
  )
}