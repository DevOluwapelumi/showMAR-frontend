import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      toast.success('Login successful!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="bg-secondary p-6 rounded w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-primary text-white"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-primary text-white"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-accent py-2 rounded text-white hover:opacity-90"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <span className="text-accent underline cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </section>
  )
}

export default Login
