import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieGrid from '../components/MovieGrid'

const backgrounds = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWR2Nms5cnkycHV4emc3MDR0cGNtc255OXZmaXM2OG01NDZoN3lobSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PAZumvIof5Y2ZOMaLs/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzhyOTZ1NjVjbTcxZzA0eTRybWQ3cGs2d3JrYWRnY2psY2d5Y3lkYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JfSeK0oKiCIL5756F9/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDdqeGtxMnpubG1nbWx5eGl5dWtkMTYxMDZvZnN4MGt6cHAxOWtwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gHKJHyoi9F5cihSLrW/giphy.gif",
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [currentBackground, setCurrentBackground] = useState(backgrounds[0])
  const [backgroundIndex, setBackgroundIndex] = useState(0)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
            page: 1,
          },
        })
        setMovies(data.results)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    fetchMovies()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCurrentBackground(backgrounds[backgroundIndex])
  }, [backgroundIndex])

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section
      className="bg-primary text-white min-h-screen px-4 md:px-10 py-8"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-7xl font-bold mb-2 text-accent">Discover. Watch. Rate.</h1>
        <p className="text-gray-500 font-bold max-w-xl mx-auto">
          Dive into the world of stories. Your next favorite movie is just a scroll away.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-md bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Movie Grid */}
      <MovieGrid movies={filteredMovies} />
    </section>
  )
}

export default Home
