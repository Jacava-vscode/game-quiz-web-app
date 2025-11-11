import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate('/play')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6D5BFF 0%, #FF6B6B 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 4, minWidth: 350, maxWidth: 400 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#6D5BFF' }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <motion.div whileFocus={{ scale: 1.05 }}>
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
            </motion.div>
            {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: '1.1rem', background: 'linear-gradient(90deg, #6D5BFF 0%, #FF6B6B 100%)' }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </motion.div>
            <Typography align="center" sx={{ mt: 2 }}>
              Need an account? <Link to="/signup" style={{ color: '#FF6B6B', fontWeight: 600 }}>Sign up</Link>
            </Typography>
          </form>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default LoginPage
