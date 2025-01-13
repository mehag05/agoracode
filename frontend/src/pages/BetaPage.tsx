import React from 'react';

const BetaModeScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <img src="/agora.svg" alt="AGORA" width={600} height={400} />
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4"></h1>
            <p className="text-lg font-bold text-gray-600 mb-6">
                Thank you for visiting agora! We are currently in beta mode.
            </p>
            <p className="text-lg font-bold text-gray-600 mb-6">
                Your feedback is invaluable to us. If you encounter any issues, please report them directly to us.
            </p>
            <a 
                href="mailto:agoraupenn@gmail.com" 
                className="mt-4 px-6 py-2 bg-[--purple] text-white rounded-lg shadow-md hover:bg-[#663399] transition duration-300"
            >
                Report an Issue
            </a>
        </div>
    );
};

export default BetaModeScreen;