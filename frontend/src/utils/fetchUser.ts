import { useState, useEffect } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { fetchUserDetails } from './fetchUserDetails'; // Adjust the import path as needed

export const FetchUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Set loading to true at the start of the fetch
      try {
        if (await Session.doesSessionExist()) {
          const userId = await Session.getUserId();
          const userDetails = await fetchUserDetails(userId);
          setUser(userDetails);
        } else {
          console.log('No session exists');
          setUser(null); // Explicitly set user to null if no session exists
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user details');
      } finally {
        setLoading(false); // Ensure loading is set to false in the finally block
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};