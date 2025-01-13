import React from 'react';
import { useLocation } from "react-router-dom";
import { sendEmail } from '../auth/email_verification'; // Import the sendEmail function

const EmailSentPage = () => {
    const location = useLocation(); // Get the current location
    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const toEmail = queryParams.get('to') || ""; // Get 'to' email from query parameters

    const handleResend = async () => {
        await sendEmail(); // Call the sendEmail function to resend the verification email
    };

    return (
        <div className='flex items-center justify-center h-screen' style={{ backgroundColor: 'white' }}>
            <div className='bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto flex flex-col items-center space-y-8'>
                <div className='flex flex-col items-center justify-center space-y-6 text-center'>
                    <div className='flex items-center justify-center mb-6 h-40 w-40'>
                        <img
                            src='/email-sent.png'
                            width={160}
                            height={160}
                            alt='email sent image'
                        />
                    </div>

                    <h3 className='font-bold text-3xl text-[#5c1a99]'>
                        Check your email
                    </h3>

                    {toEmail ? (
                        <p className='text-lg text-[#5c1a99]'>
                            We&apos;ve sent a verification link to{' '}
                            <span className='font-semibold text-gray-900'>
                                {toEmail}
                            </span>.
                        </p>
                    ) : (
                        <p className='text-lg text-gray-700'>
                            We&apos;ve sent a verification link to your email. It may take a few minutes to arrive.
                        </p>
                    )}

                    <button 
                        onClick={handleResend} 
                        className='mt-4 bg-[--gold] text-white py-2 px-6 rounded shadow-lg hover:bg-[--purple] transition duration-300'
                    >
                        Resend Verification Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailSentPage;
