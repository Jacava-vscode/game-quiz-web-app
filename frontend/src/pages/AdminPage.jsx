import { useCallback, useEffect, useState } from 'react'
import AdminCategoryForm from '../components/AdminCategoryForm.jsx'
import AdminQuestionForm from '../components/AdminQuestionForm.jsx'
import {
  adminCreateCategory,
  adminCreateQuestion,
  adminDeleteQuestion,
  adminFetchCategories,
  adminFetchQuestions
} from '../services/apiClient.js'
import React from 'react';

const AdminPage = () => {
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [savingQuestion, setSavingQuestion] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)

  const loadData = useCallback(async () => {
    setLoadingQuestions(true)
    try {
      const [categoryData, questionData] = await Promise.all([
        adminFetchCategories(),
        adminFetchQuestions()
      ])
      setCategories(categoryData)
      setQuestions(questionData)
    } catch (error) {
      console.error('Failed to load admin data', error)
    } finally {
      setLoadingQuestions(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateCategory = async (payload) => {
    setSavingCategory(true)
    try {
      const category = await adminCreateCategory(payload)
      setCategories((prev) => [...prev, category])
      return category
    } catch (error) {
      console.error('Category creation failed', error)
      return false
    } finally {
      setSavingCategory(false)
    }
  }

  const handleCreateQuestion = async (payload) => {
    setSavingQuestion(true)
    try {
      const question = await adminCreateQuestion(payload)
      setQuestions((prev) => [question, ...prev])
      return question
    } catch (error) {
      console.error('Question creation failed', error)
      return false
    } finally {
      setSavingQuestion(false)
    }
  }

  const handleDeleteQuestion = async (id) => {
    try {
      await adminDeleteQuestion(id)
      setQuestions((prev) => prev.filter((question) => question._id !== id))
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  return (
    <div>
      <section className="admin-page">
        <header>
          <h1>Admin Panel</h1>
          <p>Curate quizzes, categories, and track community activity.</p>
        </header>

        <div className="admin-page__forms">
          <AdminCategoryForm loading={savingCategory} onSubmit={handleCreateCategory} />
          <AdminQuestionForm categories={categories} loading={savingQuestion} onSubmit={handleCreateQuestion} />
        </div>

        <section className="admin-page__list">
          <h3>Question Library</h3>
          {loadingQuestions ? (
            <div className="page-loader">Loading questions...</div>
          ) : (
            <ul>
              {questions.map((question) => (
                <li key={question._id}>
                  <div>
                    <strong>{question.question}</strong>
                    <span>{question.category} · {question.difficulty}</span>
                  </div>
                  <button
                    className="btn btn--ghost"
                    onClick={() => handleDeleteQuestion(question._id)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      {/* Admin dashboard, question/category/user management, analytics, and Framer Motion animations will be implemented here */}
    </div>
  )
}

export default AdminPage
