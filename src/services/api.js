import axios from 'axios'

// const BASE_URL = 'https://showmar-backend.onrender.com/api'

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // only if you're using cookies or sessions
// });

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api
