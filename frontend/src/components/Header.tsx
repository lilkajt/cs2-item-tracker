import Button from './Button'
import { FiUser } from "react-icons/fi";

function Header() {
    let loggedIn = false;
    let OnSignInPage = false;
    // if logged in show dashboard header == cs2 tracker and user icon
    // if not logged in show only sign in
    // if click sign in display only logo no button on login/signup page
  return (
    <>
    <div className='w-full h-32'>
        <div className='w-full py-8 px-8 inline-flex flex-row items-center justify-between'>
            <div className="w-auto h-6 text-center justify-center text-beige-100 text-3xl font-bold font-display2 cursor-pointer">FinTrack</div>
            { loggedIn && OnSignInPage ? (
                <>
                    <div className='w-auto h-[40px] cursor-pointer text-beige-100 hover:text-beige-200 flex items-center'>
                        <div className='text-inherit font-display2 mt-2'>cs2 tracker</div>
                    </div>
                    <div className='h-[40px] w-[52px] flex items-center justify-center text-beige-100 hover:text-beige-200 cursor-pointer'>
                        <FiUser size={32}/>
                    </div>
                </>
            ) : (
                <Button color='green'>Sign In</Button>
            )}
        </div>
    </div>
    </>
  )
}

export default Header