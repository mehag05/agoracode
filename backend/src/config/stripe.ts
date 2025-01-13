import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
} else {
    console.log('STRIPE_SECRET_KEY is set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16' as any, // Bypass type restriction
});

export default stripe;