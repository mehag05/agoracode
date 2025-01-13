'use client'
import { Icons } from '../components/Icons'
import {
  Button,
  buttonVariants,
} from '../components/ui/button'
import React, { useState } from 'react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { cn } from '../lib/utils'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { signUpClicked } from '../auth/signup'
import { checkEmail } from '../auth/check_email'

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const isEmailValid = (email: string) => email.endsWith('.upenn.edu');

  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (!isEmailValid(email)) {
      window.alert('Please use a valid .upenn.edu email address.');
      return;
    }

    if (password !== confirmPassword) {
      window.alert('Passwords do not match.');
      return;
    }

    if (!isPasswordValid(password)) {
      window.alert('Password must be at least 8 characters long, contain at least one number and one special character.');
      return;
    }

    const emailExists = await checkEmail(email);
    if (emailExists) {
      window.alert("Email already exists. Please use a different email.");
      return;
    }

    try {
      const response = await signUpClicked(email, password);

      if (response?.status === "FIELD_ERROR") {
        const fieldErrors: { email?: string; password?: string } = {};
        response.formFields.forEach(field => {
          if (field.id === 'email') {
            fieldErrors.email = field.error;
          } else if (field.id === 'password') {
            fieldErrors.password = field.error;
          }
        });
        setErrors(fieldErrors);
      } else if (response?.status === "OK") {
        navigate('/email-sent');
        toast.success('Verification email sent. Please check your inbox.');
      }
    } catch (error: any) {
      const errorMessage = error.isSuperTokensGeneralError ? error.message : 'Oops! Something went wrong.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center p-6' style={{ backgroundImage: 'url(/sellerbg.svg)' }}>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <div className='flex flex-col items-center space-y-4'>
          <Icons.logo className='h-21 w-20 mb-4' />
          <h1 className='text-3xl font-bold text-gray-900'>
            Create an account
          </h1>
          <p className='text-gray-600'>
            Join agora and start your journey today.
          </p>
          <a
            className={cn(
              buttonVariants({
                variant: 'link',
                className: 'flex items-center text-[#5c1a99] hover:text-[purple-900]',
              })
            )}
            href='/auth/signin'
          >
            Already have an account? Sign In!
            <ArrowRight className='h-5 w-5 ml-2' />
          </a>
        </div>

        <form onSubmit={onSubmit} className='space-y-6 mt-6'>
          <div className='grid gap-4'>
            <div className='grid gap-1'>
              <Label htmlFor='email' className='font-semibold text-gray-700'>Penn Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600',
                  { 'border-red-500': errors.email }
                )}
                placeholder='you@upenn.edu'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>
                  {errors.email}
                </p>
              )}
            </div>

            <div className='grid gap-1'>
  <Label htmlFor='password' className='font-semibold text-gray-700'>Password</Label>
  <div className='relative'>
    <Input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type={showPassword ? 'text' : 'password'}
      className={cn(
        'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10',
        { 'border-red-500': errors.password }
      )}
      placeholder='Password'
    />
    <button
      type='button'
      onClick={() => setShowPassword(!showPassword)}
      className='absolute inset-y-0 right-0 flex items-center pr-3'
    >
      {showPassword ? (
        <EyeOff className='h-5 w-5 text-[#5c1a99]' />
      ) : (
        <Eye className='h-5 w-5 text-[#5c1a99]' />
      )}
    </button>
  </div>
  {errors.password && (
    <p className='text-sm text-red-500'>
      {errors.password}
    </p>
  )}
</div>

<div className='grid gap-1'>
  <Label htmlFor='confirmPassword' className='font-semibold text-gray-700'>Confirm Password</Label>
  <div className='relative'>
    <Input
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      type={showPassword ? 'text' : 'password'}
      placeholder='Confirm Password'
      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10'
    />
    <button
      type='button'
      onClick={() => setShowPassword(!showPassword)}
      className='absolute inset-y-0 right-0 flex items-center pr-3'
    >
      {showPassword ? (
        <EyeOff className='h-5 w-5 text-[#5c1a99]' />
      ) : (
        <Eye className='h-5 w-5 text-[#5c1a99]' />
      )}
    </button>
  </div>
</div>

            <Button
              type='submit'
              className={buttonVariants({ variant: 'bigpurple' })}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
