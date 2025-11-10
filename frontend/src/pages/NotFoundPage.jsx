import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <section className="not-found">
    <h1>404</h1>
    <p>Looks like you took a wrong turn.</p>
    <Link className="btn" to="/">
      Return Home
    </Link>
  </section>
)

export default NotFoundPage
