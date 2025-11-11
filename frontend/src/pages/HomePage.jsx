import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import Testimonials from '../components/Testimonials.jsx'
import { useQuiz } from '../hooks/useQuiz.js'

// TODO: Import Material UI and Framer Motion components

const categories = [
  { name: 'General Knowledge', description: 'A bit of everything to test your trivia skills.' },
  { name: 'Science', description: 'Explore physics, chemistry, biology, and more.' },
  { name: 'History', description: 'Travel back in time with historic events and figures.' },
  { name: 'Gaming', description: 'Video game lore, mechanics, and releases.' }
]

const testimonials = [
  { name: 'Riley', quote: 'The real-time leaderboards make every quiz thrilling!' },
  { name: 'Amir', quote: 'I love unlocking new achievements each week.' },
  { name: 'Sky', quote: 'Beautiful visuals and clever questions.' }
]

const HomePage = () => {
  const navigate = useNavigate()
  const { setActiveCategory } = useQuiz()

  const handlePlay = () => {
    navigate('/play')
  }

  const handleSelectCategory = (category) => {
    setActiveCategory(category.name)
    navigate('/play')
  }

  return (
    <div>
      {/* Material UI AppBar, Hero Section, Category Buttons, Testimonials, Footer, and Framer Motion animations will be implemented here */}
      <div className="home-page">
        <HeroSection onPlay={handlePlay} />
        <CategoryGrid categories={categories} onSelect={handleSelectCategory} />
        <Testimonials testimonials={testimonials} />
      </div>
    </div>
  )
}

export default HomePage
