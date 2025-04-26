import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import { useEffect, useState } from 'react'
import axios from 'axios';

function PrivateRoute() {
  const { isLoggedIn, loading, logout } = useAuthStore()
  const [verifying, setVerifying] = useState(true);
  useEffect( () => {
    const verifyAuth = async() => {
      await axios.get('/api/auth/verify')
      .catch( () => {
        logout();
      })
      .finally( ()=>{
        setVerifying(false);
      });
    }
      
    if (isLoggedIn) {
      verifyAuth();
    } else{
      setVerifying(false);
    }
  }, [isLoggedIn, logout]);

  if (loading || verifying) {
    return <div className='text-beige-100 text-center text-4xl mt-8'>Loading...</div>
  }
  
  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute;