import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Favorites from "./pages/Favorites";

// Layout Component
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default function App() {
  return (
    <>
      <PWAInstallPrompt />
      <Router>
        <Routes>
          {/* Shared Layout Route */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route
              path="/watchlist"
              element={
                <PrivateRoute>
                  <Watchlist />
                </PrivateRoute>
              }
            />

            {/* Standalone Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/fav" element={<Favorites />} />

            <Route
              path="*"
              element={
                <div className="text-white text-center">
                  404: Page not found
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
