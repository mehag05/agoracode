import stripe from '../config/stripe'; // Import the initialized Stripe instance
import { UserModel } from '../models/user'; // Import your User model
import { Request, Response } from 'express';

// Create Account Link
export const createAccountLink = async (req: Request, res: Response) => {
    try {
        const { account } = req.body;

        const accountLink = await stripe.accountLinks.create({
            account: account,
            return_url: `${req.headers.origin}/sell`,
            refresh_url: `${req.headers.origin}/sell`,
            type: "account_onboarding",
        });

        res.json(accountLink);
    } catch (error: any) {
        console.error(
            "An error occurred when calling the Stripe API to create an account link:",
            error
        );
        res.status(500).send({ error: error.message });
    }
};

// Create Account
export const createAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body; // Assuming you send the user ID in the request body

        const account = await stripe.accounts.create({
            controller: {
                stripe_dashboard: {
                    type: "none",
                },
                fees: {
                    payer: "application"
                },
                losses: {
                    payments: "application"
                },
                requirement_collection: "application",
            },
            capabilities: {
                transfers: { requested: true }
            },
            country: "US",
        });

        // Update the user's record in MongoDB with the Stripe account ID
        await UserModel.findByIdAndUpdate(userId, { stripe_account_id: account.id });

        res.json({
            account: account.id,
        });
    } catch (error: any) {
        console.error(
            "An error occurred when calling the Stripe API to create an account",
            error
        );
        res.status(500).send({ error: error.message });
    }
};
