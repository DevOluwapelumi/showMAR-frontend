import { useEffect, useState } from 'react'
import MovieGrid from '../components/MovieGrid'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(storedFavorites)
  }, [])

  return (
    <section className="bg-primary text-white min-h-screen px-4 md:px-10 py-8">
      <h1 className="text-3xl md:text-6xl font-bold mb-6 text-accent text-center">❤️ Favorite Movies</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorites yet. Add some from the Home page!</p>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </section>
  )
}

export default Favorites
