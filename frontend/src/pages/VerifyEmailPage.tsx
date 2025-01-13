import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consumeVerificationCode } from "../auth/post_verification"; // Adjust the import path as needed
import Session from "supertokens-web-js/recipe/session";
import { Button } from '../components/ui/button'; // Adjust the import path as needed
import Spinner from 'components/Spinner';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExists, setSessionExists] = useState(false);

    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController instance

        const checkSession = async () => {
            const exists = await Session.doesSessionExist();
            setSessionExists(exists);
            setIsLoading(false);
        };

        checkSession();

        return () => {
            abortController.abort(); // Cleanup function to abort the request
        };
    }, []);

    const handleVerifyEmail = async () => {
        setIsLoading(true);
        await consumeVerificationCode(); // Call the verification function
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {isLoading ? (
                <h1><Spinner/></h1>
            ) : (
                <div className="text-center">
                    {sessionExists ? (
                        <Button onClick={handleVerifyEmail} className="bg-[--purple] text-white hover:bg-purple-700">
                            Click here to verify your email
                        </Button>
                    ) : (
                        <p className="text-gray-700">
                            You need to log in with your email and password, then click the link we sent you again.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifyEmailPage;
