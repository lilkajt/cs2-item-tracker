import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function PrivateRoute() {
  const { isLoggedIn, loading } = useAuthStore()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute;