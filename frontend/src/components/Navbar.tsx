import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icons';
import UserAccountNav from './UserAccountNav';
import Session from 'supertokens-auth-react/recipe/session';
import ErrorBoundary from './errorboundary';
import { buttonVariants } from '../components/ui/button';
import Cart from './Cart';
import MobileNav from './MobileNav';
import { FetchUser } from 'utils/fetchUser';
import Spinner from './Spinner';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isSignInBlack = !isHomePage;
  const isWhiteBackground = !isSignInBlack; // Determine if the background is white
  const { user, loading, error } = FetchUser();
  const userFirstName = user?.firstName;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isLoggedIn = await Session.doesSessionExist();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <nav className="bg-transparent sticky z-50 top-0 inset-x-0 h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition duration-300 flex items-center">
            <Icons.logo />
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          <span className="text-white"><Spinner/></span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-transparent sticky z-50 top-0 inset-x-0 h-16 flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition duration-300 flex items-center">
          <Icons.logo />
        </Link>
        <div className="text-2xl px-4 font-bold hover:text-blue-300 transition duration-300 flex items-center">
              <Link to="/beta" className={buttonVariants({ variant: 'ghost' })} style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
                Beta Mode
              </Link>
            </div>
        {/* Render Mobile Navbar for smaller screens */}
        <div className="block md:hidden">
          <MobileNav />
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        {isAuthenticated ? (
          <div className="hidden md:flex space-x-4">
            <ErrorBoundary>
              <UserAccountNav />
            </ErrorBoundary>
          </div>
        ) : (
          <>
            {/* Render only on larger screens */}
            <div className="hidden md:flex space-x-4 ">
              <Link
                to="/auth/signin"
                className={buttonVariants({ variant: 'ghost' })}
                style={{ color: isSignInBlack ? 'black' : 'white' }}
              >
                Sign in
              </Link>
              <Link
                to="/auth/signup"
                className={buttonVariants({ variant: 'bigpurple' })}
              >
                Create account
              </Link>
            </div>
          </>
        )}
        <div>
          <Cart />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;