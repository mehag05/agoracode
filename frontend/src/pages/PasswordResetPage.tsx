'use client'
import { Icons } from '../components/Icons'
import { Button } from '../components/ui/button'
import React, { useState } from 'react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { newPasswordEntered } from '../auth/submit_newpassword' // Import your reset password function

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Call my reset password function
    try {
      await newPasswordEntered(newPassword); // This function handles errors and responses
  
      toast.success('Password reset successfully.');
      navigate('/signin'); // Redirect to sign-in page after successful reset
    } catch (error: any) {
      // Handle any unexpected errors here if necessary
      const errorMessage = error.isSuperTokensGeneralError ? error.message : 'Oops! Something went wrong.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className='relative flex pt-20 flex-col items-center justify-center'>
        <div className='mx-auto flex w-full max-w-md flex-col justify-center space-y-6'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='h-15 w-20' />
            <h1 className='text-2xl font-semibold tracking-tight'>
              Reset your password
            </h1>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={onSubmit}>
              <div className='grid gap-2'>
                {/* New Password Input */}
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='newPassword'>New password</Label>
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    className='w-full max-w-md px-4'
                    placeholder='New Password'
                  />
                </div>

                {/* Confirm Password Input */}
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    className='w-full max-w-md px-4'
                    placeholder='Confirm Password'
                  />
                </div>

                {/* Show Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-sm text-blue-500'
                >
                  {showPassword ? 'Hide' : 'Show'} Password
                </button>

                <Button variant="bigpurple" type="submit" className='w-full max-w-md px-4'>
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage;