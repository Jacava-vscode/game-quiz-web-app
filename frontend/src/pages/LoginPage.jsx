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
  return (
    <div style={{padding:40}}>
      <h2>Login Disabled</h2>
      <p>All features are now open access.</p>
    </div>
      navigate('/play')
