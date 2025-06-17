const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // make sure this is set in Render

const app = express();
app.use(cors());
app.use(express.json());

const PACKAGE_PRICES = {
  "Starter": 8999,
  "Pro": 14999,
  "Business+": 24999
};

app.post('/create-checkout-session', async (req, res) => {
  const { package } = req.body;
  const price = PACKAGE_PRICES[package];

  if (!price) {
    return res.status(400).json({ error: 'Invalid package selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `CamsWebs - ${package} Package`,
            },
            unit_amount: price,
          },
          quantity: 1
        }
      ],
      success_url: 'https://camswebs.github.io/camswebs/thankyou.html',
      cancel_url: 'https://camswebs.github.io/camswebs/',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: 'Checkout session creation failed' });
  }
});

app.listen(3000, () => console.log("✅ Stripe server running on port 3000"));
