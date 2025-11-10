import { useEffect, useState } from 'react'

const emptyOption = { text: '', isCorrect: false }

const createInitialForm = (category) => ({
  question: '',
  category: category || '',
  difficulty: 'Medium',
  timeLimit: 30,
  assetUrl: '',
  options: [
    { ...emptyOption },
    { ...emptyOption },
    { ...emptyOption },
    { ...emptyOption }
  ],
  correctAnswer: ''
})

const AdminQuestionForm = ({ categories, onSubmit, loading }) => {
  const [form, setForm] = useState(() => createInitialForm(categories[0]?.name))
  const hasCategories = categories.length > 0

  useEffect(() => {
    if (categories.length && !form.category) {
      setForm(createInitialForm(categories[0].name))
    }
  }, [categories, form.category])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hasCategories) {
      return false
    }

    const result = await onSubmit(form)
    if (result !== false) {
      setForm(createInitialForm(categories[0]?.name))
    }
    return result
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Create Question</h3>
      <label>
        Question
        <textarea
          required
          value={form.question}
          onChange={(event) => updateField('question', event.target.value)}
        />
      </label>
      <div className="admin-form__row">
        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
            disabled={!hasCategories}
          >
            {categories.map((category) => (
              <option key={category._id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(event) => updateField('difficulty', event.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Time Limit (sec)
          <input
            min="10"
            max="120"
            type="number"
            value={form.timeLimit}
            onChange={(event) => updateField('timeLimit', Number(event.target.value))}
          />
        </label>
      </div>
      <label>
        Media URL
        <input
          placeholder="https://"
          type="url"
          value={form.assetUrl}
          onChange={(event) => updateField('assetUrl', event.target.value)}
        />
      </label>
      <div className="admin-form__options">
        {form.options.map((option, index) => (
          <div className="admin-form__option" key={`option-${index}`}>
            <input
              placeholder={`Option ${index + 1}`}
              required
              type="text"
              value={option.text}
              onChange={(event) => {
                const newValue = event.target.value
                setForm((prev) => {
                  const previousOption = prev.options[index]
                  const options = prev.options.map((item, optionIndex) => (
                    optionIndex === index ? { ...item, text: newValue } : item
                  ))
                  const correctAnswer = previousOption.isCorrect ? newValue : prev.correctAnswer
                  return { ...prev, options, correctAnswer }
                })
              }}
            />
            <label>
              <input
                checked={form.correctAnswer === option.text && option.text !== ''}
                name="correct"
                type="radio"
                onChange={() => {
                  setForm((prev) => ({
                    ...prev,
                    options: prev.options.map((item, optionIndex) => ({
                      ...item,
                      isCorrect: optionIndex === index
                    })),
                    correctAnswer: prev.options[index].text
                  }))
                }}
              />
              Correct
            </label>
          </div>
        ))}
      </div>
      {!hasCategories && <p>Add a category before creating new questions.</p>}
      <button className="btn" disabled={loading || !hasCategories} type="submit">
        {loading ? 'Saving...' : 'Save Question'}
      </button>
    </form>
  )
}

export default AdminQuestionForm
