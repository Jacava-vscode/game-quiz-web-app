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
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={handleChange('password')}
          />
        </label>
        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p>
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
