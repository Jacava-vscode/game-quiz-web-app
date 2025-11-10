import { useState } from 'react'

const AdminCategoryForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ name: '', description: '' })

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
    setForm({ name: '', description: '' })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Create Category</h3>
      <label>
        Name
        <input required value={form.name} onChange={handleChange('name')} />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={handleChange('description')} />
      </label>
      <button className="btn" disabled={loading} type="submit">
        {loading ? 'Saving...' : 'Save Category'}
      </button>
    </form>
  )
}

export default AdminCategoryForm
