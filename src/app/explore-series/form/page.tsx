'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/services/api'

export default function SeriesForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    rank: '',
    jobTitle: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const storiesParam = searchParams.get('stories') || ''
    const categoriesParam = searchParams.get('categories') || ''
    
    try {
      // Submit form data with selected stories and categories
      const submissionData = {
        ...formData,
        selectedStories: storiesParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)),
        selectedCategories: categoriesParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)),
        submissionType: 'series',
        timestamp: new Date().toISOString()
      }
      
      await api.createUser(submissionData)
      router.push(`/explore-series/progress?stories=${storiesParam}&categories=${categoriesParam}`)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Still proceed to progress page even if submission fails
      router.push(`/explore-series/progress?stories=${storiesParam}&categories=${categoriesParam}`)
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.phone && formData.company && formData.rank && formData.jobTitle

  return (
    <div className="formPage">
      <div className="formContainer">
        <div className="formLeft">
          <h1>Almost There!</h1>
          <p>You're just one step away from accessing detailed customer success stories and case studies. Please fill out the form to complete your selection and get exclusive insights.</p>
          <div className="formDescription">
            <h3>What you'll get:</h3>
            <ul>
              <li>Detailed case study reports</li>
              <li>Industry-specific insights</li>
              <li>Implementation strategies</li>
              <li>Success metrics and ROI data</li>
            </ul>
          </div>
        </div>
        
        <div className="formRight">
          <form onSubmit={handleSubmit} className="contactForm">
            <div className="formRow">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="formRow">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="formRow">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="formRow">
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="formRow">
              <select
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Rank</option>
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="vp">Vice President</option>
                <option value="c-level">C-Level</option>
              </select>
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={!isFormValid}
              className="submitButton"
            >
              Access Stories
            </button>
          </form>
        </div>
      </div>
      
      <button 
        className="goBackButton"
        onClick={() => router.push('/explore-series/elements')}
      >
        Go Back
      </button>
    </div>
  )
}