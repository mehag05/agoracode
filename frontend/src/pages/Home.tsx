import MaxWidthWrapper from '../components/MaxWidthWrapper';
import ProductReel from '../components/ProductReel';
import { buttonVariants } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { FetchUser } from '../utils/fetchUser'; // Adjust the path as needed
import Session from 'supertokens-auth-react/recipe/session';
import axios from 'axios';
import Spinner from 'components/Spinner';

export default function Home() {
  const { user, loading, error } = FetchUser();
  const navigate = useNavigate();
  
  // State to manage screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isMobile = screenWidth <= 768; // Define mobile screen width threshold

  // Effect to update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isLoggedIn = await Session.doesSessionExist();
        setIsAuthenticated(isLoggedIn);
        if (isLoggedIn) {
          // Make a request to an authenticated endpoint to trigger the email verification check
          await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/protected-route`);
          console.log("Email verified")
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          // Redirect to email verification page if the email is not verified
          navigate('/email-sent');
        } else {
          console.error('Error checking session or email verification:', error);
        }
      }
    };
    checkSession();
  }, [navigate]);

  // Adjust positioning based on screen width
  const cartPositionStyle = {
    top: screenWidth <= 1000 ? '-50px' : '10px', // Above on smaller screens, beside on larger screens
    right: screenWidth <= 1000 ? '0' : '-140px' // Adjust right offset for smaller screens
  };

  if (loading) return <div><Spinner/></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-container" id="home-container">
      {isMobile ? (
        <div className="background" />
      ) : (
        <video autoPlay muted loop id="backgroundVideo" className="background-video">
          <source src="/backgroundvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <MaxWidthWrapper>
        <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl relative'>
          <div className='relative flex justify-center items-center text-md font-medium'>
            <img src="/agora.svg" alt="AGORA" width={600} height={400} />
            <Link
              to='/howitworks'
              className='absolute'
              style={cartPositionStyle} // Apply the dynamic style here
            >
              <img 
                src="/star.svg" 
                alt="How it works" 
                className='max-w-[100px] max-h-[100px] sm:max-w-[130px] sm:max-h-[130px] md:max-w-[170px] md:max-h-[170px] lg:max-w-[170px] lg:max-h-[170px]'
              />
            </Link>
          </div>
          {user ? (
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl' style={{ color: '#f8e29c' }}>
              <span className='text agora-font'>
                {user.firstName ? `Hey, ${user.firstName}` : 'Hey there!'}
              </span>
            </h1>
          ) : (
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl' style={{ color: '#f8e29c' }}>
              <span className='text agora-font'>
                Your campus marketplace.
              </span>
            </h1>
          )}
          <p className='mt-6 text-xl font-bold agora-font max-w-prose text-muted-foreground' style={{ color: '#f8e29c' }}>
            Buy and Sell.
          </p>
          <div className='flex flex-col gap-4 mt-6 items-center'>
            <Link
              to='/products'
              className={buttonVariants({ variant: 'bigpurple', size: 'lg'})}
            >
              Browse Trending
            </Link>
          </div>
        </div>
        <div className = ''>
          <ProductReel
            href='/products'
            title='Brand New'
            textColor={isMobile ? 'grey' : 'white'} // Change text color based on mobile state
          />
        </div>
      </MaxWidthWrapper>
      <Footer />
    </div>
  );
}