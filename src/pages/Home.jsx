import { useState, useEffect } from "react";
import axios from "axios";
import MovieGrid from "../components/MovieGrid";
import { useMemo } from "react";

const backgrounds = [
  "https://media1.giphy.com/media/PAZumvIof5Y2ZOMaLs/giphy.gif",
  "https://media3.giphy.com/media/JfSeK0oKiCIL5756F9/giphy.gif",
  "https://media1.giphy.com/media/gHKJHyoi9F5cihSLrW/giphy.gif",
];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    genre: "",
    year: "",
    minRating: "",
    sortBy: "",
  });

  const [currentBackground, setCurrentBackground] = useState(backgrounds[0]);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Get genres from TMDB
  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }`
      );
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Get movies from TMDB
  const fetchMovies = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=en-US&page=1`
      );
      setMovies(data.results);
      setFilteredMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentBackground(backgrounds[backgroundIndex]);
  }, [backgroundIndex]);

  // Apply filters
  useEffect(() => {
    let filtered = [...movies];

    if (filters.title) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.genre) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.includes(Number(filters.genre))
      );
    }

    if (filters.year) {
      filtered = filtered.filter((movie) =>
        movie.release_date?.startsWith(filters.year)
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(
        (movie) => movie.vote_average >= parseFloat(filters.minRating)
      );
    }

    if (filters.sortBy === "popular") {
      filtered.sort((a, b) => b.popularity - a.popularity);
    }

    if (filters.sortBy === "latest") {
      filtered.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }

    setFilteredMovies(filtered);
  }, [filters, movies]);

  ////////

  const recommendedMovies = useMemo(() => {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    const favoriteGenres = [...new Set(favoriteMovies.map((m) => m.genre))];

    const recommended = allMovies.filter(
      (m) =>
        favoriteGenres.includes(m.genre) &&
        !favoriteMovies.some((fav) => fav.id === m.id) // don't recommend already favorited
    );

    return recommended.slice(0, 10); // show only top 10
  }, [allMovies]);

  {
    recommendedMovies.length > 0 && (
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-accent">
          🎯 Recommended For You
        </h2>
        <MovieGrid movies={recommendedMovies} />
      </div>
    );
  }

  return (
    <section
      className="bg-primary text-white min-h-screen px-4 md:px-10 py-8"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-7xl font-bold mb-2 text-accent">
          Discover. Watch. Rate.
        </h1>
        <p className="text-gray-500 font-bold max-w-xl mx-auto">
          Dive into the world of stories. Your next favorite movie is just a
          scroll away.
        </p>
      </div>

      {/* FILTER UI */}
      <div className="bg-secondary p-6 rounded-xl shadow-md mb-8 grid gap-4 md:grid-cols-6 sm:grid-cols-2 grid-cols-1">
        <input
          type="text"
          placeholder="🔍 Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          className="rounded px-4 py-2 text-black"
        />

        <select
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="rounded px-4 py-2 text-black"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="📅 Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="rounded px-4 py-2 text-black"
        />

        <input
          type="number"
          placeholder="⭐ Min Rating"
          min={1}
          max={10}
          value={filters.minRating}
          onChange={(e) =>
            setFilters({ ...filters, minRating: e.target.value })
          }
          className="rounded px-4 py-2 text-black"
        />

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="rounded px-4 py-2 text-black"
        >
          <option value="">Sort By</option>
          <option value="popular">🔥 Popularity</option>
          <option value="latest">🆕 Latest</option>
        </select>

        <button
          onClick={() =>
            setFilters({
              title: "",
              genre: "",
              year: "",
              minRating: "",
              sortBy: "",
            })
          }
          className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
        >
          Reset Filters
        </button>
      </div>

      {/* MOVIE GRID */}
      <MovieGrid
        movies={filteredMovies.map((movie) => ({
          ...movie,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
    </section>
  );
};

export default Home;
