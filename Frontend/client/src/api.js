import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refresh = localStorage.getItem("refresh")

      if (!refresh) {
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(
        `${import.meta.env.VITE_API_URL}users/token/refresh/`,
        { refresh }
      )

        localStorage.setItem("access", res.data.access)

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`

        return API(originalRequest)

      } catch (err) {
        // 🔥 DO NOT FORCE REDIRECT
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("user")

        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default API