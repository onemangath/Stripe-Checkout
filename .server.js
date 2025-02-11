require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.get("/", (req, res) => {
  res.send("Welcome to Stripe Checkout Server!");
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { price_id } = req.body;
    if (!price_id) {
      return res.status(400).json({ error: 'Missing price_id' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['promptpay'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));