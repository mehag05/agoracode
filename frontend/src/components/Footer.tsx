'use client'
import React from 'react'
import { useLocation } from 'react-router-dom'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { IUser } from 'schema/user'
import { FetchUser } from 'utils/fetchUser'

const Footer = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const pathsToMinimize = [
    '/verify-email',
    '/sign-up',
    '/sign-in',
  ];

  const { user, loading, error } = FetchUser(); // Fetch the user object

  const handleSellClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.alert('Please sign in to sell!');
      window.location.href = '/auth/signin';
    }
  };

  return (
    <footer className='bg-white flex-grow-0'>
      <MaxWidthWrapper>
        <div className='border-t border-gray-200'>
          {pathsToMinimize.includes(pathname ?? '') ? null : (
            <div className='pb-8 pt-16'>
              <div className='flex justify-center'>
                <Icons.logo className='h-12 w-auto' />
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname ?? '') ? null : (
            <div>
              <div className='relative flex items-center px-6 py-6 sm:py-8 lg:mt-0'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div
                    aria-hidden='true'
                    className='absolute bg-zinc-50 inset-0 bg-gradient-to-br bg-opacity-90'
                  />
                </div>

                <div className='text-center relative mx-auto max-w-sm'>
                  <h3 className='font-semibold text-gray-900'>
                    Become a seller
                  </h3>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    If you&apos;d like to sell, you can do so in
                    minutes.{' '}
                    <a
                      href='/sell'
                      className='whitespace-nowrap font-medium text-black hover:text-zinc-900'
                      onClick={handleSellClick} // Add this line
                    >
                      Get started &rarr;
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='py-10 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left flex items-center space-x-4'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
            <p className='text-sm text-muted-foreground'>
               <a href="mailto:agoraupenn@gmail.com" className="text-black hover:text-zinc-900">Have an inquiry? Contact Us!</a>
            </p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <a
                href='/terms-conditions'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Terms
              </a>
              <a
                href='/privacy-policy'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </a>
              <a
                href='https://www.instagram.com/agora.upenn?igsh=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr'
                className='text-muted-foreground hover:text-gray-600'
                aria-label='Instagram'>
                <img src="/instagram.svg" alt="AGORA" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer;