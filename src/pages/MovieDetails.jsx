import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api, { setAuthToken } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", comment: "" });

  const fetchMovieDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}`,
        {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: "en-US",
          },
        }
      );
      setMovie(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching movie details:", err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieDetails();
    // fetchReviews()
  }, [id]);

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        Loading movie details...
      </div>
    );
  }

  /// --- Ne Function

  let userId = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    }
  } catch (err) {
    console.warn("Token parse failed", err);
  }

  setAuthToken(localStorage.getItem("token"));

  const handleAddToWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/users/watchlist", { movieId: movie.id });
      toast.success("Added to Watchlist 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding movie 😞");
    }
  };

  /// --- New Function

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch {
      console.error("Error loading reviews");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to leave a review");
      return navigate("/login");
    }

    setAuthToken(token); // this should update your axios header

    try {
      await api.post("/reviews", {
        movieId: movie.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      toast.success("✅ Review submitted!");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      setNewReview({ rating: "", comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit review");
    }
  };

  /// --- New Function

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setAuthToken(token);

    try {
      await api.put(`/reviews/${editingReviewId}`, editForm);
      toast.success("Review updated!");
      setEditingReviewId(null);
      setEditForm({ rating: "", comment: "" });
      fetchReviews();
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <>
      <section className="bg-primary text-white min-h-screen px-4 md:px-10 py-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl w-full flex flex-col md:flex-row gap-10 bg-secondary/20 backdrop-blur-md p-6 rounded-xl shadow-lg"
        >
          {/* Poster */}
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-1/3 rounded-xl shadow-md object-cover"
          />

          {/* Movie Info + Review Section */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-accent mb-2">
              {movie.title}
            </h1>
            <p className="text-gray-400 italic">{movie.tagline}</p>

            <div className="space-y-2 text-sm md:text-base">
              <p>
                <strong>Overview:</strong> {movie.overview}
              </p>
              <p>
                <strong>Release Date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Runtime:</strong> {movie.runtime} minutes
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)} / 10
              </p>
            </div>

            {/* Review Form */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3">Leave a Review</h3>
              <form
                onSubmit={handleReviewSubmit}
                className="space-y-3 max-w-lg"
              >
                <input
                  type="number"
                  placeholder="Rating (1–10)"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-secondary text-white outline-none"
                  min={1}
                  max={10}
                  required
                />
                <textarea
                  placeholder="Write your comment..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-secondary text-white outline-none"
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToWatchlist}
                className="bg-accent px-4 py-2 rounded-md hover:bg-opacity-90 transition"
              >
                + Add to Watchlist
              </motion.button>

              <a
                href={`https://www.youtube.com/results?search_query=${movie.title}+trailer`}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Watch Trailer (YouTube)
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-primary text-white px-4 md:px-10 pb-10 ">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">User Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-secondary rounded p-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>@{review.user?.username || "Anonymous"}</span>
                    <span>⭐ {review.rating}/10</span>
                  </div>
                  {editingReviewId === review._id ? (
                    <form onSubmit={handleEditSubmit} className="space-y-2">
                      <input
                        type="number"
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rating: e.target.value })
                        }
                        className="w-full px-3 py-1 rounded text-black"
                        min={1}
                        max={10}
                      />
                      <textarea
                        value={editForm.comment}
                        onChange={(e) =>
                          setEditForm({ ...editForm, comment: e.target.value })
                        }
                        className="w-full px-3 py-1 rounded text-black"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-accent px-3 py-1 rounded text-white text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="text-red-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-white">{review.comment}</p>
                      {review.user?._id === userId && (
                        <div className="flex gap-3 mt-2 text-sm">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-yellow-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MovieDetails;
