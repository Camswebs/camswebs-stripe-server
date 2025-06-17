const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // make sure it's set in Render

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'CamsWebs Website Package',
            },
            unit_amount: price,
          },
          quantity: 1
        }
      ],
      success_url: 'https://camswebs.github.io/camswebs/thankyou.html',
      cancel_url: 'https://camswebs.github.io/camswebs/',
    });

    res.json({ url: session.url }); // ✅ IMPORTANT: return the actual URL
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: 'Checkout session creation failed' });
  }
});

app.listen(3000, () => console.log("✅ Stripe server running on port 3000"));
