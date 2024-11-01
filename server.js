// import dotenv from 'dotenv';
// import express from 'express';
// import Stripe from 'stripe';

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const app = express();
// app.use(express.json());

// app.post('/create-payment-intent', async (req, res) => {
//     const { products } = req.body;

//     try {
//         // Calculate the total amount based on products
//         const amount = products.reduce((total, product) => {
//             return total + product.price * product.quantity;
//         }, 0);

//         // Create a PaymentIntent with the calculated amount
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, // Amount in cents
//             currency: 'usd',
//         });

//         // Send the client_secret to the client
//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error('Error creating payment intent:', error.message);
//         res.status(500).json({ error: 'Failed to create payment intent' });
//     }
// });

// app.listen(3000, () => console.log('Server started on port 3000'));


// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe('sk_test_your_secret_key'); // Apne asli secret key se replace karein

app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const { Title, Description, Amount, Image } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'gbp', // Pounds ka currency code
                    product_data: {
                        name: Title,
                        description: Description,
                        images: [Image],
                    },
                    unit_amount: Amount * 100, // Amount pounds mein, cents mein convert karna
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        res.json({ clientSecret: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


