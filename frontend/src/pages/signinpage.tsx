'use client';
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Button, buttonVariants } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cn } from '../lib/utils';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { signInClicked } from '../auth/signin';
import { sendEmailClicked } from '../auth/forgotpassword';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await signInClicked(email, password);

      if (response?.status === 'FIELD_ERROR') {
        const fieldErrors: { email?: string; password?: string } = {};
        response.formFields.forEach(field => {
          if (field.id === 'email') {
            fieldErrors.email = field.error;
          } else if (field.id === 'password') {
            fieldErrors.password = field.error;
          }
        });
        setErrors(fieldErrors);
      } else if (response?.status === 'WRONG_CREDENTIALS_ERROR') {
        toast.error('Incorrect email or password.');
      } else if (response?.status === 'SIGN_IN_NOT_ALLOWED') {
        toast.error(response.reason);
      } else if (response?.status === 'OK') {
        toast.success('Signed in successfully.');
        navigate('/');
        window.location.reload();
      }
    } catch (error: any) {
      const errorMessage = error.isSuperTokensGeneralError ? error.message : 'Oops! Something went wrong.';
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordMode(true);
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    await sendEmailClicked(email);
    setForgotPasswordMode(false);
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center p-6' style={{ backgroundImage: 'url(/shapesbg.gif)' }}>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <div className='flex flex-col items-center space-y-4'>
          <Icons.logo className='h-21 w-20 mb-4' />
          <h1 className='text-3xl font-bold text-gray-900'>
            {forgotPasswordMode ? 'Reset Your Password' : 'Sign in to your account'}
          </h1>
          {!forgotPasswordMode && (
            <a
              className={cn(
                buttonVariants({
                  variant: 'link',
                  className: 'flex items-center text-[#5c1a99] hover:text-[purple-900]',
                })
              )}
              href='/auth/signup'
            >
              Don't have an account? Sign up!
              <ArrowRight className='h-5 w-5 ml-2' />
            </a>
          )}
        </div>

        <form onSubmit={onSubmit} className='space-y-6 mt-6'>
          <div className='grid gap-4'>
            <div className='grid gap-1'>
              <Label htmlFor='email' className='font-semibold text-gray-700'>Email</Label>
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

            {!forgotPasswordMode && (
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
            )}

            {forgotPasswordMode ? (
              <Button
                variant='bigpurple'
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            ) : (
              <>
                <Button
                  variant='bigpurple'
                  type='submit'
                  className='py-2'
                >
                  Sign In
                </Button>

                <Button
                  variant='link'
                  onClick={handleForgotPassword}
                  style={{ color: 'var(--gold)' }}
                >
                  Forgot Password?
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
