import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await signup(form)
      navigate('/play')
    } catch (error) {
      console.error('Signup failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* New animated signup form will be implemented here */}
    </div>
  )
}

export default SignupPage
