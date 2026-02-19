import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 max-w-xl w-full text-center">
        <p className="text-6xl font-display font-bold gradient-text">404</p>
        <h1 className="text-2xl font-display font-semibold mt-2">Page not found</h1>
        <p className="text-white/60 mt-3">
          The page you are trying to open does not exist. Please go back to the home page.
        </p>
        <Link to="/" className="btn-luxury inline-block mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
