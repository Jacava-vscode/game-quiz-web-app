import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__content">
        <Link to="/" className="navbar__brand">
          Game Quiz
        </Link>
        <nav className="navbar__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/play">Play Quiz</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          {user && <NavLink to="/profile">Profile</NavLink>}
          {user?.roles?.includes('admin') && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="navbar__actions">
          {!user && (
            <>
              <Link className="btn btn--ghost" to="/login">Login</Link>
              <Link className="btn" to="/signup">Sign Up</Link>
            </>
          )}
          {user && (
            <button className="btn" onClick={logout} type="button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
