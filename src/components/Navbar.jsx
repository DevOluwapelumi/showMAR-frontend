import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isLoggedIn = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsOpen(false)
    navigate('/login')
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`transition hover:text-accent ${
        pathname === to ? 'text-accent font-semibold' : ''
      }`}
    >
      {label}
    </Link>
  )

  ///

  const { theme, toggleTheme } = useContext(ThemeContext)


  return (
    <nav className="sticky top-0 z-50 bg-primary text-white px-4 md:px-8 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl md:text-2xl font-bold text-accent">
        🎬 ShowMAR
      </Link>

      {/* Mobile Menu Toggle */}
      <button onClick={toggleMenu} className="md:hidden z-50">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-4 md:gap-6 items-center text-sm md:text-base">
        <li>{navLink('/', 'Home')}</li>
        {isLoggedIn ? (
          <>
            <li>{navLink('/watchlist', 'Watchlist')}</li>
            <li>{navLink('/profile', 'Profile')}</li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-accent text-white px-3 py-1 rounded-md hover:opacity-90 transition"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>{navLink('/login', 'Login')}</li>
            <li>{navLink('/register', 'Sign Up')}</li>
          </>
        )}
        <li>
  <button onClick={toggleTheme} className="hover:text-accent transition">
    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </button>
</li>

      </ul>

      {/* Animated Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-secondary shadow-lg z-40 p-6 md:hidden"
            >
              <ul className="flex flex-col gap-6 text-white text-base">
                <li>{navLink('/', 'Home')}</li>
                {isLoggedIn ? (
                  <>
                    <li>{navLink('/watchlist', 'Watchlist')}</li>
                    <li>{navLink('/profile', 'Profile')}</li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="bg-accent text-white px-3 py-1 rounded hover:opacity-90 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>{navLink('/login', 'Login')}</li>
                    <li>{navLink('/register', 'Sign Up')}</li>
                  </>
                )}
              </ul>
            </motion.div>

            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
