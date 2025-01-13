import React from 'react';
import Navbar from './Navbar';
//import Providers from './Providers';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import '../styles/globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative h-full font-inter antialiased'>
        <Navbar />
        <main className='flex-grow flex-1'>
          {children}
        </main>
        <Footer/>
      <Toaster position='top-center' richColors />
    </div>
  );
};

export default Layout;