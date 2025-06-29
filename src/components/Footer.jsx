import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Footer = () => {

   const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubscribe = async (e) => {
    e.preventDefault()

    if (!email) {
      return toast.error('Email is required ✉️')
    }
    if (!isValidEmail(email)) {
      return toast.warning('Enter a valid email address 😓')
    }
    if (!consent) {
      return toast.info('You must accept our privacy policy ✅')
    }

    try {
      // 👉 Fake wait or real API call here (Formspree, Express, etc.)
      // Example: await axios.post('/api/subscribe', { email })
      toast.success('You’ve subscribed successfully 🎉')
      setEmail('')
      setConsent(false)
    } catch  {
      toast.error('Something went wrong! 🚨')
    }
  }


  return (
    <footer className="bg-secondary text-gray-300 dark:text-gray-400 py-10 px-4 md:px-10 mt-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Logo + About */}
        <div>
          <Link to="/" className="text-2xl font-bold text-accent">🎬 ShowMAR</Link>
          <p className="mt-2 text-sm max-w-xs">
            Your go-to platform for discovering and rating movies. Built with ❤️ by DevOluwapelumi.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/watchlist" className="hover:text-accent">Watchlist</Link></li>
              <li><Link to="/profile" className="hover:text-accent">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">More</h4>
            <ul className="space-y-1">
              <li><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-accent">TMDB API</a></li>
              <li><a href="https://github.com/your-github" className="hover:text-accent">GitHub</a></li>
              <li><a href="mailto:youremail@example.com" className="hover:text-accent">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="font-semibold text-white mb-3">📬 Stay in the Loop</h4>
          <p className="text-sm mb-4">Get updates on new movies and features. No spam. Ever.</p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-primary text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
            />

            <label className="text-xs flex items-start gap-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              I agree to the <span className="text-accent underline cursor-pointer">privacy policy</span>
            </label>

            <button
              type="submit"
              className="bg-accent px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShowMAR. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
