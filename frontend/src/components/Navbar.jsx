import { Link, NavLink } from 'react-router-dom'
const Navbar = () => (
  <header className="navbar">
    <div className="navbar__content">
      <Link to="/" className="navbar__brand">Game Quiz</Link>
      <nav className="navbar__links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/featured">Featured Quizzes</NavLink>
        <NavLink to="/updates">Latest Updates</NavLink>
        <NavLink to="/testimonials">User Testimonials</NavLink>
        <div className="navbar__dropdown">
          <span>Categories</span>
          <div className="navbar__dropdown-content">
            <NavLink to="/categories/action">Action</NavLink>
            <NavLink to="/categories/strategy">Strategy</NavLink>
            <NavLink to="/categories/sports">Sports</NavLink>
            <NavLink to="/categories/adventure">Adventure</NavLink>
            <NavLink to="/categories/puzzle">Puzzle</NavLink>
          </div>
                <ul className="nav-sections">
                  <li className="nav-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Featured</span>
                    <ul className="dropdown">
                      <li><NavLink to="/featured">Featured Quizzes</NavLink></li>
                      <li><NavLink to="/latest">Latest Updates</NavLink></li>
                      <li><NavLink to="/testimonials">User Testimonials</NavLink></li>
                    </ul>
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Categories</span>
                    <ul className="dropdown">
                      <li><NavLink to="/categories/action">Action</NavLink></li>
                      <li><NavLink to="/categories/strategy">Strategy</NavLink></li>
                      <li><NavLink to="/categories/sports">Sports</NavLink></li>
                      <li><NavLink to="/categories/adventure">Adventure</NavLink></li>
                      <li><NavLink to="/categories/puzzle">Puzzle</NavLink></li>
                    </ul>
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Quizzes</span>
                    <ul className="dropdown">
                      <li><NavLink to="/quizzes">All Quizzes</NavLink></li>
                      <li><NavLink to="/my-quizzes">My Quizzes</NavLink></li>
                      <li><NavLink to="/challenge">Challenge a Friend</NavLink></li>
                    </ul>
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Admin Panel</span>
                    <ul className="dropdown">
                      <li><NavLink to="/admin">Dashboard</NavLink></li>
                      <li><NavLink to="/admin/users">Manage Users</NavLink></li>
                      <li><NavLink to="/admin/quizzes">Manage Quizzes</NavLink></li>
                      <li><NavLink to="/admin/categories">Manage Categories</NavLink></li>
                    </ul>
                    {/* Note: When auth is added, show this to admin users only */}
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Profile</span>
                    <ul className="dropdown">
                      <li><NavLink to="/profile">View Profile</NavLink></li>
                      <li><NavLink to="/profile/edit">Edit Profile</NavLink></li>
                      <li><NavLink to="/profile/history">Quiz History</NavLink></li>
                      <li><NavLink to="/profile/achievements">Achievements</NavLink></li>
                      <li><NavLink to="/profile/challenges">Challenges</NavLink></li>
                      <li><NavLink to="/profile/challenges/active">Active Challenges</NavLink></li>
                      <li><NavLink to="/profile/challenges/history">Challenge History</NavLink></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/leaderboard">Leaderboards</NavLink>
                  </li>
                  <li className="nav-item nav-dropdown">
                    <span>Help</span>
                    <ul className="dropdown">
                      <li><NavLink to="/help/faq">FAQ</NavLink></li>
                      <li><NavLink to="/help/support">Contact Support</NavLink></li>
                      <li><NavLink to="/legal/terms">Terms of Service</NavLink></li>
                      <li><NavLink to="/legal/privacy">Privacy Policy</NavLink></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/logout">Logout</NavLink>
                  </li>
                </ul>
