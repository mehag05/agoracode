import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserAccountNav from './UserAccountNav';
import Session from 'supertokens-auth-react/recipe/session';
import ErrorBoundary from './errorboundary';
import { buttonVariants } from '../components/ui/button';
import Cart from './Cart';
import Spinner from './Spinner';

const MobileNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

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

  // Show a loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <nav className="bg-transparent sticky z-50 top-0 inset-x-0 h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center">
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-4 flex flex-col justify-center items-center space-y-1"
        >
          {/* Hamburger Icon */}
          <div
            className={`h-1 w-6 bg-[#f8e29c] transition-transform duration-300 ease-in-out rounded-md ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <div
            className={`h-1 w-6 bg-[#f8e29c] transition-opacity duration-300 ease-in-out rounded-md ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <div
            className={`h-1 w-6 bg-[#f8e29c] transition-transform duration-300 ease-in-out rounded-md ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>
      {isOpen && (
        <div className='relative top-16 left-0 right-0 bg-transparent p-4'>
          {isAuthenticated ? (
            <div className='flex flex-col space-y-2'>
              <ErrorBoundary>
                <UserAccountNav />
              </ErrorBoundary>
            </div>
          ) : (
            <div className='flex flex-col'>
              <Link 
                to="/auth/signin"
                className={`${buttonVariants({ variant: 'ghost' })} w-full py-4 text-lg text-center`}
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className={`${buttonVariants({ variant: 'bigpurple' })} w-full py-4 text-lg text-center`}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;