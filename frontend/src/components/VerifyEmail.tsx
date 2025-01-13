'use client'
import React from 'react'
import { Loader2, XCircle } from 'lucide-react'
import { buttonVariants } from './ui/button'

interface VerifyEmailProps {
    isLoading: boolean;
    isError: boolean;
    isVerified: boolean;
  }

const VerifyEmail = ({ isLoading, isError, isVerified }: VerifyEmailProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='animate-spin h-8 w-8 text-zinc-300' />
        <h3 className='font-semibold text-xl'>Verifying...</h3>
        <p className='text-muted-foreground text-sm'>This won't take long.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <XCircle className='h-8 w-8 text-red-600' />
        <h3 className='font-semibold text-xl'>There was a problem</h3>
        <p className='text-muted-foreground text-sm'>
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
          <img
            src='/email-verified.png'
            width={200}
            height={200}
            alt='Email verified'
          />
        </div>
        <h3 className='font-semibold text-2xl'>You're all set!</h3>
        <p className='text-muted-foreground text-center mt-1'>
          Thank you for verifying your email.
        </p>
        <a
          className={buttonVariants({ className: 'mt-4' })}
          href='/auth/signin'>
          Sign in
        </a>
      </div>
    );
  }

  return null; // Fallback return
};

export default VerifyEmail;