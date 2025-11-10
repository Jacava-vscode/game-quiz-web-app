const LeaderboardTable = ({ scores }) => (
  <table className="leaderboard">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Player</th>
        <th>Score</th>
        <th>Category</th>
        <th>Difficulty</th>
      </tr>
    </thead>
    <tbody>
      {scores.map((entry, index) => (
        <tr key={`${entry.username}-${entry._id || index}`}>
          <td>{index + 1}</td>
          <td>{entry.username}</td>
          <td>{entry.score}</td>
          <td>{entry.category || 'All'}</td>
          <td>{entry.difficulty || 'Any'}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default LeaderboardTable
