const ProfileStats = ({ profile }) => (
  <section className="profile">
    <div className="profile__header">
      <img
        alt={profile.username}
        className="profile__avatar"
        src={profile.avatarUrl || 'https://avatars.dicebear.com/api/identicon/gq.svg'}
      />
      <div>
        <h2>{profile.username}</h2>
        <p>{profile.email}</p>
        <strong>Total Score: {profile.score}</strong>
      </div>
    </div>
    <div className="profile__achievements">
      <h3>Achievements</h3>
      <ul>
        {profile.achievements?.length
          ? profile.achievements.map((item) => <li key={item}>{item}</li>)
          : <li>No achievements yet</li>}
      </ul>
    </div>
    <div className="profile__history">
      <h3>Recent Quizzes</h3>
      <ul>
        {profile.completedQuizzes?.length
          ? profile.completedQuizzes.slice(-5).reverse().map((quiz, index) => (
            <li key={`${quiz.quizId}-${index}`}>
              <span>{quiz.category || 'Mixed'}</span>
              <span>{quiz.difficulty || 'Any'}</span>
              <strong>{quiz.score} pts</strong>
            </li>
          ))
          : <li>No quiz history yet</li>}
      </ul>
    </div>
  </section>
)

export default ProfileStats
