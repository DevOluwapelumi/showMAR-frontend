import { Link } from 'react-router-dom'

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
     className="relative group rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-black w-full" >
      {/* Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-72 object-cover group-hover:opacity-80 transition-opacity duration-300"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition duration-300" />

      {/* Info */}
      <div className="absolute bottom-0 w-full px-3 py-2 bg-opacity-0 group-hover:bg-opacity-100 group-hover:bg-black transition duration-300">
        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
        <div className="flex justify-between items-center text-xs text-gray-300 mt-1">
          <span>{movie.release_date?.split('-')[0]}</span>
          <span className="text-yellow-400 font-semibold">
            ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>

      {/* Rating badge */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-2 py-0.5 rounded text-yellow-400 text-xs font-medium">
        ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
      </div>
    </Link>
  )
}

export default MovieCard
