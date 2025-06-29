import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../services/api'
import MovieCard from '../components/MovieCard'
import axios from 'axios'
import toast from 'react-hot-toast'

const Watchlist = () => {
  const [movieIds, setMovieIds] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')
    setAuthToken(token)

    const fetchWatchlist = async () => {
      try {
        const { data } = await api.get('/users/watchlist')
        setMovieIds(data)
      } catch  {
        toast.error('Error fetching watchlist')
      }
    }

    fetchWatchlist()
  }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY
      const moviePromises = movieIds.map((id) =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: apiKey },
        })
      )

      const results = await Promise.all(moviePromises)
      setMovies(results.map((res) => res.data))
      setLoading(false)
    }

    if (movieIds.length > 0) fetchMovies()
    else setLoading(false)
  }, [movieIds])

  const handleRemove = async (movieId) => {
    try {
      await api.delete(`/users/watchlist/${movieId}`)
      toast.success('Removed from Watchlist')
      setMovieIds((prev) => prev.filter((id) => id !== movieId))
    } catch  {
      toast.error('Failed to remove')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-20">Loading your watchlist...</div>
  }

  return (
    <section className="bg-primary text-white min-h-screen px-4 md:px-10 py-10">
      <h2 className="text-2xl md:text-4xl font-bold text-accent mb-6">My Watchlist 🎬</h2>

      {movies.length === 0 ? (
        <p className="text-gray-400">You haven't added any movies yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie} />
              <button
                onClick={() => handleRemove(movie.id)}
                className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded-full text-xs hover:opacity-90"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Watchlist
