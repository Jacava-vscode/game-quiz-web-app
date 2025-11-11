import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }
    try {
      await signup({ username: form.username, email: form.email, password: form.password })
      navigate('/play')
    } catch (err) {
      setError('Signup failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FF6B6B 0%, #6D5BFF 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 4, minWidth: 350, maxWidth: 400 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#FF6B6B' }}>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <motion.div whileFocus={{ scale: 1.05 }}>
              <TextField
                label="Username"
                fullWidth
                required
                margin="normal"
                value={form.username}
                onChange={handleChange('username')}
                variant="outlined"
                color="secondary"
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                value={form.email}
                onChange={handleChange('email')}
                variant="outlined"
                color="secondary"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={form.password}
                onChange={handleChange('password')}
                variant="outlined"
                color="secondary"
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                variant="outlined"
                color="secondary"
              />
            </motion.div>
            {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: '1.1rem', background: 'linear-gradient(90deg, #FF6B6B 0%, #6D5BFF 100%)' }}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </motion.div>
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account? <Link to="/login" style={{ color: '#6D5BFF', fontWeight: 600 }}>Login</Link>
            </Typography>
          </form>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default SignupPage
