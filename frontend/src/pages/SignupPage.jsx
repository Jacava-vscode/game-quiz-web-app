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
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <label>
          Username
          <input
            required
            value={form.username}
            onChange={handleChange('username')}
          />
        </label>
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}

export default SignupPage
