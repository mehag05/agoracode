import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buttonVariants } from '../components/ui/button';
import { FetchUser } from '../utils/fetchUser'; // Adjust the import path as needed
import axios from 'axios'; // Ensure axios is imported
import { Link } from 'react-router-dom';

const VerifyEmailSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController instance

        const updateVerificationStatus = async () => {
            try {
                const { user, loading, error } = await FetchUser(); // Fetch the user
                if (user && user.supertokens_id) {
                    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-user`, { userId: user.supertokens_id, verified: true });
                    if (res.status === 200) {
                        console.log("User verification status updated successfully.");
                    } else {
                        console.error("Failed to update verification status.");
                    }
                }
            } catch (error) {
                console.error("Error fetching user or updating verification status:", error);
            }
        };

        updateVerificationStatus();

        return () => {
            abortController.abort(); // Cleanup function to abort the request
        };
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen"
            style={{ backgroundImage: 'none', backgroundColor: 'white' }}
        >
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-[#5c1a99]">🎉 Email Verified Successfully!</h1>
                <p className="mt-4 text-gray-700 text-lg">Thank you for verifying your email. You can now access all features.</p>
                <div className=" mt-6">
                    <Link
                        to="/"
                        className={buttonVariants({ variant: 'bigpurple' })}
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailSuccessPage;
