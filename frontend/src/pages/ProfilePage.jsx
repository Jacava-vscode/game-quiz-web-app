import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileStats from '../components/ProfileStats.jsx'
import { updateProfile } from '../services/apiClient.js'
import { useAuth } from '../hooks/useAuth.js'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { token, user, setUser } = useAuth()
  const [form, setForm] = useState({ username: '', avatarUrl: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    if (user) {
      setForm({ username: user.username, avatarUrl: user.avatarUrl || '' })
    }
  }, [token, user, navigate])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...(form.username ? { username: form.username } : {}),
        ...(form.avatarUrl ? { avatarUrl: form.avatarUrl } : {})
      }
      const updated = await updateProfile(payload)
      setUser(updated)
    } catch (error) {
      console.error('Profile update failed', error)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <div className="page-loader">Loading profile...</div>
  }

  return (
    <section className="profile-page">
      <ProfileStats profile={user} />
      <form className="profile-form" onSubmit={handleSubmit}>
        <h3>Update Profile</h3>
        <label>
          Username
          <input value={form.username} onChange={handleChange('username')} />
        </label>
        <label>
          Avatar URL
          <input
            placeholder="https://"
            value={form.avatarUrl}
            onChange={handleChange('avatarUrl')}
          />
        </label>
        <button className="btn" disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default ProfilePage
