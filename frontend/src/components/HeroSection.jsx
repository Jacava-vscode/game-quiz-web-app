import { Link } from 'react-router-dom'
import ThreeScene from './ThreeScene.jsx'

const HeroSection = ({ onPlay }) => (
  <section className="hero">
    <div className="hero__text">
      <h1>Challenge Your Mind</h1>
      <p>Compete in real-time quizzes, climb the leaderboard, and unlock epic achievements.</p>
      <div className="hero__actions">
        <button className="btn btn--primary" onClick={onPlay} type="button">
          Start Quiz
        </button>
        <Link className="btn btn--ghost" to="/leaderboard">View Leaderboard</Link>
      </div>
    </div>
    <div className="hero__visual">
      <ThreeScene />
    </div>
  </section>
)

export default HeroSection
