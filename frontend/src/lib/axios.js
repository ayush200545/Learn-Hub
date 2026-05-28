import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercept 401 Unauthorized to refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = useAuthStore.getState().refreshToken
      if (refresh) {
        try {
          const res = await axios.post('/api/auth/token/refresh/', { refresh })
          const newAccess = res.data.access
          
          useAuthStore.getState().setAuth({ access: newAccess, refresh })
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          
          return apiClient(originalRequest)
        } catch (refreshErr) {
          useAuthStore.getState().logout()
          return Promise.reject(refreshErr)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
