import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { motion } from 'framer-motion'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signup(form)
      navigate('/play')
    } catch (err) {
      setError('Signup failed. Please check your details.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <motion.form
        className="auth-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Create Account</motion.h1>
        <motion.label htmlFor="signup-username" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          Username
          <motion.input
            id="signup-username"
            required
            autoComplete="username"
            value={form.username}
            onChange={handleChange('username')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          />
        </motion.label>
        <motion.label htmlFor="signup-email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          Email
          <motion.input
            id="signup-email"
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
          />
        </motion.label>
        <motion.label htmlFor="signup-password" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          Password
          <motion.input
            id="signup-password"
            required
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
          />
        </motion.label>
        <motion.button
          className="btn"
          disabled={loading}
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          animate={{ backgroundColor: loading ? '#6c5ce7' : '#222' }}
          transition={{ duration: 0.2 }}
        >
          {loading ? <motion.span className="spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} /> : 'Sign Up'}
        </motion.button>
        {error && (
          <motion.div
            className="auth-error"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Already have an account? <Link to="/login">Login</Link>
        </motion.p>
      </motion.form>
    </section>
  )
}

export default SignupPage
