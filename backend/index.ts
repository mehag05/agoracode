import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { middleware, errorHandler, SessionRequest } from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./src/middleware/auth";
import { router as apiRouter } from './src/routes/api';
import webhookRouter from './src/routes/webhook';
import { createAccountLink, createAccount } from './src/services/stripeAccount'; // Import the functions
import cors from 'cors';
import { Request } from 'express';
import { getApiDomain } from './src/middleware/auth';
import Stripe from 'stripe';
import upload from './src/config/s3Config';

import bodyParser from 'body-parser';

supertokens.init(SuperTokensConfig);

const express = require('express');

const app = express();

const multer = require('multer');
const sharp = require('sharp');

supertokens.init(SuperTokensConfig);

interface CorsOptions {
    origin: boolean | string;
    allowedHeaders: string[];
    methods: string[];
    credentials: boolean;
}

const corsOptionsDelegate = async function (
    req: Request,
    callback: (err: Error | null, options?: CorsOptions) => void
) {
    try {
        const allowedOrigins = [
            'https://www.shopatagora.com', 
            'https://shopatagora.com', 
            getWebsiteDomain(), 
            getApiDomain(),
            'http://localhost:3000',
            'http://localhost:3001'
        ];
        const origin = allowedOrigins.includes(req.headers.origin || '') ? req.headers.origin : false;

        const corsOptions: CorsOptions = {
            origin: origin,
            allowedHeaders: ['content-type', 'x-api-key', 'x-parent-domain', ...supertokens.getAllCORSHeaders()],
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            credentials: true
        };

        callback(null, corsOptions);
    } catch (e) {
        console.error('CORS Error:', e);
        callback(new Error('Internal Server Error'));
    }
};

const path = require('path');

const PORT = process.env.PORT || 3001; // Use the PORT from environment variables or default to 3001

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    console.log('Origin:', req.headers.origin);
    next();
});

// CORS configuration
app.use(cors(corsOptionsDelegate));

// Custom middleware to choose body parser based on route
app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhook') {
        // Use raw body parser for the webhook
        bodyParser.raw({ type: 'application/json' })(req, res, next);
    } else {
        // Use JSON body parser for other routes
        bodyParser.json()(req, res, next);
    }
});

// Use SuperTokens middleware
app.use(middleware());

// Other API routes
app.use('/api', apiRouter);

// Use the webhook router
app.use('/api/webhook', webhookRouter);

app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
    const session = req.session;
    res.send({
        sessionHandle: session!.getHandle(),
        userId: session!.getUserId(),
        accessTokenPayload: session!.getAccessTokenPayload(),
    });
});

app.post("/account_link", createAccountLink);
app.post("/account", createAccount);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

// Add a simple route to verify the server is running
app.get('/health', (req, res) => {
    res.send('Server is running');
});

// Add a middleware to log response headers
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log('Response Headers:', res.getHeaders());
    });
    next();
});

// how to do this dynamically so if works with both localhost and the live server?
console.log('Attempting to start server with PORT:', PORT);
console.log('process.env.PORT:', process.env.PORT);
console.log(`Attempting to bind to port: ${PORT}`);
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1); // Exit the process with an error code
    }
    console.log(`Server is running on port ${PORT}`);
});