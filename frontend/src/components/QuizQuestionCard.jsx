const QuizQuestionCard = ({ question, onAnswer, selected, locked }) => (
  <div className="quiz-card">
    <h3>{question.question}</h3>
    <div className="quiz-card__options">
      {question.options.map((option) => (
        <button
          key={option.text}
          className={`quiz-option ${selected === option.text ? 'quiz-option--selected' : ''}`}
          onClick={() => onAnswer(option.text)}
          type="button"
          disabled={locked}
        >
          {option.text}
        </button>
      ))}
    </div>
  </div>
)

export default QuizQuestionCard
