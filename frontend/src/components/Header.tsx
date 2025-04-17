import Button from './Button'
import { FiUser } from "react-icons/fi";
import useAuthStore from '@/store/useAuthStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
    const {isLoggedIn} = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const isSignInPage = location.pathname === '/sign-in';
    const handleSignIn = () => {
        navigate('/sign-in');
    };
  return (
    <>
    <div className='w-full h-32'>
        <div className='w-full py-8 px-8 inline-flex flex-row items-center justify-between'>
            <Link to={'/'}>
                <div className="w-auto h-6 text-center text-beige-100 text-3xl font-bold font-display2 cursor-pointer">FinTrack</div>
            </Link>
            { isLoggedIn && (
                <>
                    <Link to={'/dashboard'}>
                        <div className='w-auto h-[40px] cursor-pointer text-beige-100 hover:text-beige-200 flex items-center'>
                            <div className='text-inherit font-display2 mt-2'>cs2 tracker</div>
                        </div>
                    </Link>
                    <Link to={'/profile'}>
                        <div className='h-[40px] w-[52px] flex items-center justify-center text-beige-100 hover:text-beige-200 cursor-pointer'>
                            <FiUser size={32}/>
                        </div>
                    </Link>
                </>
            )}
            { !isLoggedIn && !isSignInPage && (
                <Button onClick={handleSignIn} color='green'>Sign In</Button>
            )}
        </div>
    </div>
    </>
  )
}

export default Header