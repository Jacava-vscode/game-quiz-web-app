const Scoreboard = ({ currentScore, total, timeLeft }) => (
  <aside className="scoreboard">
    <div>
      <span>Score</span>
      <strong>{currentScore}</strong>
    </div>
    <div>
      <span>Progress</span>
      <strong>{total}</strong>
    </div>
    <div>
      <span>Timer</span>
      <strong>{timeLeft}s</strong>
    </div>
  </aside>
)

export default Scoreboard
