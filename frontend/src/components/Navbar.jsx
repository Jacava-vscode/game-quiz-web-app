import { Link, NavLink } from 'react-router-dom'
const Navbar = () => (
  <header className="navbar">
    <div className="navbar__content">
      <Link to="/" className="navbar__brand">
        Game Quiz
      </Link>
      <nav className="navbar__links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/play">Play Quiz</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
      <div className="navbar__actions">
        {/* All access: no login/signup/logout buttons */}
      </div>
    </div>
  </header>
)

export default Navbar
