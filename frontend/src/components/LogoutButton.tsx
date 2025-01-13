import React, { forwardRef } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { buttonVariants } from './ui/button';

interface LogoutButtonProps {
  className?: string;
}

// Wrap the component with forwardRef
const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(({ className }, ref) => {
  const handleLogout = async () => {
    try {
      await Session.signOut();
      console.log('Logged out');
      window.location.href = '/'; // Redirect to home page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <button ref={ref} onClick={handleLogout} className={className}>
      Logout
    </button>
  );
});

// Set display name for better debugging
LogoutButton.displayName = 'LogoutButton';

export default LogoutButton;