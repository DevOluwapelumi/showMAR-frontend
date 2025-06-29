// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

const Profile = () => {
  const [user, setUser] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [avatar, setAvatar] = useState(null)
const [avatarPreview, setAvatarPreview] = useState(null)




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me')
        setUser(res.data)
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',
        })
        setLoading(false)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load user profile')
      }
    }

    fetchUser()
  }, [])

  const confettiEffect = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('name', formData.name)
    form.append('email', formData.email)
    form.append('password', formData.password)
    if (avatar) form.append('avatar', avatar)

    try {
      await api.put('/users/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      
    // ✅ Immediately update user state with new data
    const updatedAvatar = avatar
      ? `/uploads/${avatar.name.replace(/\s+/g, '')}` // filename logic if necessary
      : user.avatarUrl

    setUser((prev) => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      avatarUrl: updatedAvatar,
    }))

      toast.success('Profile updated 🎉')
      confettiEffect()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file)) // create a local preview
  }
}


  if (loading) return <p className="text-white text-center mt-10">Loading profile...</p>

  return (
    <section className="bg-primary min-h-screen text-white px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-secondary rounded-2xl p-8 shadow-2xl"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-accent shadow-lg overflow-hidden">
            {user.avatarUrl ? (
              <img src={avatarPreview || `http://localhost:5000${user.avatarUrl}`} alt="Profile" className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
  onChange={handleAvatarChange}
            className="text-sm text-gray-300 file:text-accent file:mr-2"
          />
        </div>

        {/* User Info Display */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">👤 My Profile</h1>
          <p className="text-sm text-gray-400">@{user.username}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-400">{user.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-accent"
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent py-2 rounded text-white font-semibold hover:opacity-90 transition"
          >
            ✅ Update Profile
          </button>
        </form>
      </motion.div>
    </section>
  )
}



export default Profile
