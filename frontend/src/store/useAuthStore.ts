import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

type User = {
  _id: string
  username: string
  email: string
  status: string
  createdAt: Date
  updatedAt: Date
}

type AuthState = {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  loginWithCredentials: (username: string, password: string) => Promise<void>
  checkAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      loading: false,
      
      login: (user) => set({ user, isLoggedIn: true }),
      
      logout: async () => {
        set({ user: null, isLoggedIn: false });
        try {
          const response = await axios.get('/api/auth/logout');
          return response.data;
        } catch (error) {
          set({loading: false})
          throw error
        }
      },
      
      setLoading: (loading) => set({ loading }),
      
      loginWithCredentials: async (username, password) => {
        set({ loading: true })
        try {
          const response = await axios.post('/api/auth/signin', { login: username, password: password })
          set({ user: response.data, isLoggedIn: true, loading: false })
          return response.data
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },
      checkAuth() {
        const storedAuth = localStorage.getItem('auth-storage');
        if (!storedAuth) {
          set({user: null, isLoggedIn: false});
          return
        }
        try {
          const parsedAuth = JSON.parse(storedAuth);
          const state = parsedAuth.state
          if (!state || !state.user){
            set({user: null, isLoggedIn: false});
          }
        } catch (error) {
          console.error("Error parsing auth storage", error);
          set({user: null, isLoggedIn: false});
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore;