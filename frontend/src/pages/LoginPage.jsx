import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await login(form)
      navigate('/play')
    } catch (error) {
      console.error('Login failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* New animated login form will be implemented here */}
    </div>
  )
}

export default LoginPage
