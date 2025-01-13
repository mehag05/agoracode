import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Session from 'supertokens-web-js/recipe/session';
import { fetchUserDetails } from '../utils/fetchUserDetails';
import Spinner from './Spinner';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController instance
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

    return () => {
      abortController.abort(); // Cleanup function to abort the request
    };
  }, []);

  // Show a loading indicator while checking authentication
  if (isAuthenticated === null) {
    return <div><Spinner /></div>;
  }

  // Redirect to the login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  // Pass user details to the child component
  return React.cloneElement(children, { user });
};

export default PrivateRoute;