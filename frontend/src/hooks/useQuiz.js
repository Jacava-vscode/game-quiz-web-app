import { useContext } from 'react'
import { QuizContext } from '../context/QuizContext.jsx'

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}
