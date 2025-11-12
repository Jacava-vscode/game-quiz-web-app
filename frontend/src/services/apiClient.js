import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://game-quiz-backend.onrender.com/api'
})

// Note: temporary debug log removed. axios baseURL continues to use VITE_API_URL when present.

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gq_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginUser = async (credentials) => {
  const { data } = await api.post('/login', credentials)
  return data
}

export const signupUser = async (payload) => {
  const { data } = await api.post('/signup', payload)
  return data
}

export const getProfile = async (token) => {
  const { data } = await api.get('/profile', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  return data
}

export const updateProfile = async (payload) => {
  const { data } = await api.post('/profile/update', payload)
  return data
}

export const fetchQuestions = async (params) => {
  const { data } = await api.get('/questions', { params })
  return data
}

export const submitAnswers = async (payload) => {
  const { data } = await api.post('/answers', payload)
  return data
}

export const fetchLeaderboard = async (params) => {
  const { data } = await api.get('/leaderboard', { params })
  return data
}

export const adminFetchQuestions = async () => {
  const { data } = await api.get('/admin/questions')
  return data
}

export const adminCreateQuestion = async (payload) => {
  const { data } = await api.post('/admin/questions', payload)
  return data
}

export const adminDeleteQuestion = async (id) => {
  await api.delete(`/admin/questions/${id}`)
}

export const adminFetchCategories = async () => {
  const { data } = await api.get('/admin/categories')
  return data
}

export const adminCreateCategory = async (payload) => {
  const { data } = await api.post('/admin/categories', payload)
  return data
}
