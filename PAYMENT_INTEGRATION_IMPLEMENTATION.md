# Payment Integration Implementation Guide

## 🎯 Overview

This guide provides step-by-step implementation for integrating Stripe payments into your LuckyMan card game.

---

## 📦 Step 1: Install Dependencies

```bash
cd backend
npm install stripe
npm install express-validator  # For input validation
```

---

## 🔑 Step 2: Stripe Account Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...  # Use sk_live_... for production
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # After setting up webhook
```

---

## 💻 Step 3: Backend Implementation

### Create Payment Service (`backend/services/paymentService.js`)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create a payment intent for buying bounty
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  /**
   * Retrieve payment intent
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();
```

---

### Create Payment Routes (`backend/routes/payments.js`)

```javascript
const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { body, validationResult } = require('express-validator');
const db = require('../config/database'); // Your database connection
const authMiddleware = require('../middleware/auth'); // JWT verification

/**
 * Create payment intent for buying bounty
 * POST /api/payments/create-intent
 */
router.post('/create-intent', 
  authMiddleware, // Verify user is logged in
  [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
    body('packageId').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, packageId } = req.body;
      const userId = req.user.username; // From JWT token

      // Bounty packages (optional - can be stored in database)
      const packages = {
        'small': { amount: 5, bounty: 1000 },
        'medium': { amount: 10, bounty: 2500 },
        'large': { amount: 20, bounty: 5500 },
        'xlarge': { amount: 50, bounty: 15000 },
      };

      let finalAmount = amount;
      let bountyAmount = amount * 200; // Default: $1 = 200 bounty

      if (packageId && packages[packageId]) {
        finalAmount = packages[packageId].amount;
        bountyAmount = packages[packageId].bounty;
      }

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(
        finalAmount,
        'usd',
        {
          userId,
          type: 'bounty_purchase',
          bountyAmount: bountyAmount.toString(),
          packageId: packageId || 'custom',
        }
      );

      // Store pending transaction in database
      const query = `INSERT INTO payment_transactions 
        (user_id, payment_intent_id, amount, bounty_amount, status, created_at) 
        VALUES (?, ?, ?, ?, 'pending', NOW())`;
      
      db.query(query, [userId, paymentIntent.id, finalAmount, bountyAmount], (err) => {
        if (err) {
          console.error('Failed to store transaction:', err);
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        amount: finalAmount,
        bountyAmount,
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

/**
 * Webhook endpoint for Stripe events
 * POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    const event = paymentService.verifyWebhookSignature(req.body, signature);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent) {
  const { userId, bountyAmount } = paymentIntent.metadata;
  const paymentIntentId = paymentIntent.id;

  return new Promise((resolve, reject) => {
    // Start transaction
    db.beginTransaction((err) => {
      if (err) return reject(err);

      // Update transaction status
      db.query(
        `UPDATE payment_transactions 
         SET status = 'completed', updated_at = NOW() 
         WHERE payment_intent_id = ?`,
        [paymentIntentId],
        (err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          // Add bounty to user account
          db.query(
            `UPDATE person_info 
             SET bounty = bounty + ? 
             WHERE username = ?`,
            [parseInt(bountyAmount), userId],
            (err) => {
              if (err) {
                return db.rollback(() => reject(err));
              }

              // Commit transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => reject(err));
                }

                // Emit Socket.IO event to notify user
                const io = require('../server').getIO();
                io.to(`user_${userId}`).emit('bounty_updated', {
                  newBounty: /* fetch from DB */,
                  added: parseInt(bountyAmount),
                });

                resolve();
              });
            }
          );
        }
      );
    });
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent) {
  const paymentIntentId = paymentIntent.id;

  db.query(
    `UPDATE payment_transactions 
     SET status = 'failed', updated_at = NOW() 
     WHERE payment_intent_id = ?`,
    [paymentIntentId],
    (err) => {
      if (err) console.error('Failed to update transaction:', err);
    }
  );
}

/**
 * Get user's payment history
 * GET /api/payments/history
 */
router.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user.username;

  db.query(
    `SELECT * FROM payment_transactions 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch payment history' });
      }
      res.json({ transactions: results });
    }
  );
});

module.exports = router;
```

---

### Update Server.js

```javascript
// Add payment routes
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

// Export io for use in other modules
app.set('io', io);
module.exports.getIO = () => io;
```

---

### Create Database Table

```sql
CREATE TABLE payment_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  bounty_amount INT NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_payment_intent_id (payment_intent_id),
  INDEX idx_status (status)
);
```

---

## 🎨 Step 4: Frontend Implementation

### Install Stripe.js

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

### Create Payment Component (`frontend/src/components/payments/BuyBountyModal.jsx`)

```jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Axios from 'axios';
import { useSnackbar } from '../../components/contexts/Snackbarcontext';
import { useLogin } from '../../components/contexts/Logincontext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const API_URL = process.env.REACT_APP_API_URL;

const BountyPackages = [
  { id: 'small', amount: 5, bounty: 1000, bonus: 0 },
  { id: 'medium', amount: 10, bounty: 2500, bonus: 0 },
  { id: 'large', amount: 20, bounty: 5500, bonus: 500 },
  { id: 'xlarge', amount: 50, bounty: 15000, bonus: 2000 },
];

function CheckoutForm({ onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const snackbar = useSnackbar();
  const loginContext = useLogin();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const response = await Axios.post(
        `${API_URL}/api/payments/create-intent`,
        {
          amount: selectedPackage ? BountyPackages.find(p => p.id === selectedPackage).amount : parseFloat(customAmount),
          packageId: selectedPackage,
        },
        {
          headers: {
            Authorization: localStorage.getItem('jwtToken'),
          },
        }
      );

      const { clientSecret, bountyAmount } = response.data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        snackbar.controlSnackBar(error.message, 'error');
        setLoading(false);
      } else if (paymentIntent.status === 'succeeded') {
        snackbar.controlSnackBar(
          `Successfully added ${bountyAmount} bounty to your account!`,
          'success'
        );
        
        // Update user bounty in context
        loginContext.refreshUser();
        
        onSuccess();
        onClose();
      }
    } catch (error) {
      snackbar.controlSnackBar('Payment failed. Please try again.', 'error');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h3>Buy Bounty</h3>
      
      {/* Package Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Select Package:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {BountyPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => {
                setSelectedPackage(pkg.id);
                setCustomAmount('');
              }}
              style={{
                border: selectedPackage === pkg.id ? '2px solid #007bff' : '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedPackage === pkg.id ? '#f0f8ff' : 'white',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>${pkg.amount}</div>
              <div>{pkg.bounty.toLocaleString()} Bounty</div>
              {pkg.bonus > 0 && (
                <div style={{ color: 'green', fontSize: '12px' }}>
                  +{pkg.bonus} Bonus!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div style={{ marginBottom: '20px' }}>
        <label>Or Enter Custom Amount:</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedPackage(null);
          }}
          placeholder="Enter amount in USD"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      {/* Card Element */}
      <div style={{ marginBottom: '20px' }}>
        <label>Card Details:</label>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || (!selectedPackage && !customAmount)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : `Pay $${selectedPackage ? BountyPackages.find(p => p.id === selectedPackage).amount : customAmount || '0'}`}
      </button>
    </form>
  );
}

export default function BuyBountyModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #ddd' }}>
          <h2>Buy Bounty</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
            ×
          </button>
        </div>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={() => {}} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}
```

---

### Add to Frontend Environment

```env
# .env.production
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🔔 Step 5: Webhook Setup

### Local Testing (Development)

1. Install Stripe CLI:
```bash
stripe listen --forward-to localhost:8050/api/payments/webhook
```

2. Copy webhook secret to `.env`

### Production Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to production `.env`

---

## 🧪 Step 6: Testing

### Test Cards (Stripe Test Mode)

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Flow

1. User clicks "Buy Bounty"
2. Selects package or enters amount
3. Enters test card details
4. Payment processes
5. Webhook received
6. Bounty added to account
7. User notified via Socket.IO

---

## 🛡️ Step 7: Security Enhancements

### Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many payment attempts, please try again later.',
});

router.post('/create-intent', paymentLimiter, ...);
```

### Validate Amounts

```javascript
const MAX_PAYMENT_AMOUNT = 1000; // $1000 max per transaction
const MIN_PAYMENT_AMOUNT = 1; // $1 minimum

if (amount > MAX_PAYMENT_AMOUNT || amount < MIN_PAYMENT_AMOUNT) {
  return res.status(400).json({ error: 'Invalid amount' });
}
```

---

## 📊 Step 8: Payment Analytics

### Track Metrics

- Total revenue
- Average transaction value
- Conversion rate
- Popular packages
- Refund rate

### Dashboard Query Example

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as transactions,
  SUM(amount) as revenue,
  AVG(amount) as avg_amount
FROM payment_transactions
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🎁 Step 9: Bonus Features

### Referral System

```javascript
// Add referral bonus when user makes first purchase
if (isFirstPurchase && referralCode) {
  // Give bonus to referrer
  db.query(
    `UPDATE person_info SET bounty = bounty + ? WHERE username = ?`,
    [500, referrerUsername]
  );
}
```

### Subscription Plans

```javascript
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
});

// Handle subscription webhooks
case 'customer.subscription.created':
case 'customer.subscription.updated':
case 'customer.subscription.deleted':
```

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys added to environment
- [ ] Payment service implemented
- [ ] Payment routes created
- [ ] Database table created
- [ ] Frontend component built
- [ ] Webhook endpoint configured
- [ ] Test payments completed
- [ ] Security measures added
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Production webhook configured

---

## 🚀 Next Steps

1. Implement payment history page
2. Add refund functionality
3. Create admin payment dashboard
4. Add email receipts
5. Implement subscription plans
6. Add payment analytics

---

**Support:** For issues, check [Stripe Documentation](https://stripe.com/docs) or contact Stripe support.

