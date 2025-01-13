'use client';
import React from 'react';
import { Icons } from '../components/Icons';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6' style={{ backgroundImage: 'url(/shapesbg.gif)' }}>
      <MaxWidthWrapper>
        <div className='bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full mx-auto'>
          <div className='flex flex-col items-center space-y-4'>
            <Icons.logo className='h-21 w-20 mb-4' />
            <h1 className='text-3xl font-bold text-gray-900'>Privacy Policy</h1>
            <p className='text-sm text-gray-500'>Effective Date: 9/2/2024</p>
          </div>

          <div className='mt-6 space-y-4'>
            <h2 className='text-2xl font-semibold'>1. Introduction</h2>
            <p>Welcome to Agora. We are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our online marketplace.</p>

            <h2 className='text-2xl font-semibold'>2. Information We Collect</h2>
            <p>We collect the following types of personal information:</p>
            <ul className='list-disc list-inside'>
              <li><strong>Seller Information:</strong> When you register as a seller, we collect your name, school email address, and the details of the items you upload for sale.</li>
              <li><strong>Sales Data:</strong> We track the number of sales you make and the amount of money you earn through our platform.</li>
              <li><strong>Payment Information:</strong> We utilize Stripe, a third-party payment processor, to handle payments made by buyers and payouts to sellers. Stripe may collect additional information as required for processing transactions.</li>
            </ul>

            <h2 className='text-2xl font-semibold'>3. How We Use Your Information</h2>
            <ul className='list-disc list-inside'>
              <li><strong>Internal Record Keeping:</strong> We use your information to maintain records of your activity on our platform, including sales and earnings.</li>
              <li><strong>Access Control:</strong> Your school email address is used to verify that only UPenn students have access to our marketplace.</li>
              <li><strong>Payment Processing:</strong> Stripe processes payments and payouts securely, ensuring that your financial information is handled with the utmost care.</li>
            </ul>

            <h2 className='text-2xl font-semibold'>4. Data Security</h2>
            <p>We are committed to ensuring that your information is secure. All data is encrypted and stored safely. We implement suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.</p>

            <h2 className='text-2xl font-semibold'>5. Sharing Your Information</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. The only exception is Stripe, which is used solely for payment processing and operates under its own privacy policy.</p>

            <h2 className='text-2xl font-semibold'>6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. If you wish to exercise any of these rights, please contact us at <a href="mailto:agoraupenn@gmail.com" className='text-purple-600 hover:underline'>agoraupenn@gmail.com</a>.</p>

            <h2 className='text-2xl font-semibold'>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will notify you via email if the changes are significant.</p>

            <h2 className='text-2xl font-semibold'>8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:agoraupenn@gmail.com" className='text-purple-600 hover:underline'>agoraupenn@gmail.com</a>.</p>
          </div>

          <div className='flex justify-center mt-8'>
            <Link to='/' className='text-center'>
              <Button variant='bigpurple'>Back to Home</Button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default PrivacyPolicy;