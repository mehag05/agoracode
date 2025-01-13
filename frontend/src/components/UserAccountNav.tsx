'use client';

import Session from 'supertokens-web-js/recipe/session';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { fetchUserDetails } from '../utils/fetchUserDetails'; // Import the utility function
import { IUser } from '../schema/user';
import LogoutButton from './LogoutButton';

const UserAccountNav = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current path
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController instance
    const fetchUser = async () => {
      try {
        const isLoggedIn = await Session.doesSessionExist();
        setIsAuthenticated(isLoggedIn);
        if (isLoggedIn) {
          console.log('Session exists');
          const userId = await Session.getUserId();
          console.log('Fetched userId:', userId);
          const result = await fetchUserDetails(userId);
          if (result) {
            console.log('Fetched userDetails:', result.userDetails);
            setUser(result.userDetails);
          } else {
            console.log('Failed to fetch user details');
          }
        } else {
          console.log('No session exists');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();

    return () => {
      abortController.abort(); // Cleanup function to abort the request
    };
  }, []);

  const isHomePage = location.pathname === '/'; // Check if the current path is the home page
  const buttonTextColor = isHomePage ? 'text-white' : 'text-black'; // Set text color based on the page

  return (
    <div className='relative'>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='overflow-visible'>
            <Button variant='ghost' size='sm' className={`relative ${buttonTextColor}`}>
              My Account
            </Button>
          </DropdownMenuTrigger>
          {/* Why tis not working? */}
          <DropdownMenuContent className='bg-white w-60' align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
              <div className='flex flex-col space-y-0.5 leading-none'>
                <p className='font-medium text-sm text-black'>{user?.firstName}</p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className='hover:bg-gray-200 hover:text-gray-700'>
              <a href='/sell'>Seller Dashboard</a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className='hover:bg-gray-200 hover:text-gray-700'>
              <a href='/orders'>My Orders</a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className='hover:bg-gray-200 hover:text-gray-700'>
              <a href='/settings'>Account Settings</a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className='hover:bg-gray-200 hover:text-gray-700'>
              <LogoutButton className='text-black w-full'/>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <p>Please log in to access your account.</p>
      )}
    </div>
  );
};

export default UserAccountNav;
