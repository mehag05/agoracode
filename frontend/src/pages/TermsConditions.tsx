'use client';
import React from 'react';
import { Icons } from '../components/Icons';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className='min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6' style={{ backgroundImage: 'url(/shapesbg.gif)' }}>
      <MaxWidthWrapper>
        <div className='bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full mx-auto'>
          <div className='flex flex-col items-center space-y-4'>
            <Icons.logo className='h-21 w-20 mb-4' />
            <h1 className='text-3xl font-bold text-gray-900'>Terms & Conditions</h1>
          </div>

          <div className='mt-6 space-y-4'>
            <h2 className='text-2xl font-semibold'>1. Introduction</h2>
            <p>Welcome to Agora. By accessing or using our online marketplace, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.</p>

            <h2 className='text-2xl font-semibold'>2. User Accounts</h2>
            <h3 className='font-semibold'>Registration</h3>
            <p>To use Agora, you must register for an account using your UPenn email address. You agree to provide accurate, complete, and up-to-date information during registration.</p>

            <h3 className='font-semibold'>Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your account information and password. Any activity under your account is your responsibility.</p>

            <h2 className='text-2xl font-semibold'>3. Marketplace Rules</h2>
            <h3 className='font-semibold'>Listing Items</h3>
            <p>You may list items for sale on Agora, provided they comply with all applicable laws and our guidelines. You must only upload items you currently possess, not prospective or future listings.</p>

            <h3 className='font-semibold'>Prohibited Items</h3>
            <p>The following items are not allowed on Agora: food, drinks, services (services to come after Beta Mode!), and anything illegal or in violation of UPenn’s policies.</p>

            <h3 className='font-semibold'>Buyer and Seller Responsibilities</h3>
            <p>Sellers are responsible for accurately describing their items and fulfilling orders. Buyers are responsible for paying for items purchased.</p>

            <h2 className='text-2xl font-semibold'>4. Payments and Fees</h2>
            <h3 className='font-semibold'>Payment Processing</h3>
            <p>Payments are processed through Stripe, our third-party payment processor. Stripe’s terms and conditions apply to all transactions.</p>

            <h3 className='font-semibold'>Seller Payouts</h3>
            <p>Sellers will receive payouts through Stripe. Any fees associated with payment processing will be disclosed prior to the transaction.</p>

            <h3 className='font-semibold'>Agora Fees</h3>
            <p>Agora charges a 10% fee on each item sold. This fee will be deducted from the seller's earnings. Stripe's fees are not included in this 10%.</p>

            <h2 className='text-2xl font-semibold'>5. User Content</h2>
            <h3 className='font-semibold'>Ownership</h3>
            <p>As a user, you retain ownership of the content you upload, including item listings and images.</p>

            <h3 className='font-semibold'>License</h3>
            <p>By uploading content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content on Agora.</p>

            <h2 className='text-2xl font-semibold'>6. Privacy</h2>
            <h3 className='font-semibold'>Privacy Policy</h3>
            <p>Your use of Agora is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.</p>

            <h2 className='text-2xl font-semibold'>7. Prohibited Activities</h2>
            <p>You agree not to engage in the following activities:</p>
            <ul className='list-disc list-inside'>
              <li>Using Agora for any illegal purpose.</li>
              <li>Harassing, abusing, or harming other users.</li>
              <li>Posting false, misleading, or defamatory content.</li>
            </ul>

            <h2 className='text-2xl font-semibold'>8. Termination of Use</h2>
            <p>We reserve the right to suspend or terminate your account at our discretion if you violate these Terms and Conditions. Upon termination, your right to access Agora will cease immediately.</p>

            <h2 className='text-2xl font-semibold'>9. Liability</h2>
            <h3 className='font-semibold'>Disclaimer of Warranties</h3>
            <p>Agora is provided "as is" without any warranties, express or implied. We do not guarantee that the platform will be secure or error-free.</p>

            <h3 className='font-semibold'>Limitation of Liability</h3>
            <p>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of Agora.</p>

            <h2 className='text-2xl font-semibold'>10. Governing Law</h2>
            <p>These Terms and Conditions are governed by the laws of the State of Pennsylvania, without regard to its conflict of laws principles.</p>

            <h2 className='text-2xl font-semibold'>11. Changes to the Terms</h2>
            <p>We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and we will notify you via email if the changes are significant. Your continued use of Agora after any changes constitutes acceptance of the new terms.</p>

            <h2 className='text-2xl font-semibold'>12. Contact Information</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:agoraupenn@gmail.com" className='text-purple-600 hover:underline'>agoraupenn@gmail.com</a>.</p>
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

export default TermsConditions;