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
          // Signup page removed for full-access mode
          const SignupPage = () => <div style={{padding:40}}><h2>Signup Disabled</h2><p>All features are now open access.</p></div>
          export default SignupPage
                onChange={handleChange('username')}
