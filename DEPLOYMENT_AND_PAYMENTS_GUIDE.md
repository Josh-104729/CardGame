# Production Deployment & Payment Integration Guide

## 🚀 Production Deployment Roadmap

### Phase 1: Pre-Deployment Security Fixes (MUST DO FIRST)

Before deploying to production, you **MUST** fix these critical security issues:

1. ✅ **SQL Injection** - Use parameterized queries
2. ✅ **Password Hashing** - Implement bcrypt
3. ✅ **JWT Secret** - Move to environment variable
4. ✅ **Input Validation** - Add validation middleware
5. ✅ **File Upload Security** - Validate and sanitize uploads
6. ✅ **CORS Configuration** - Restrict to your domain
7. ✅ **Rate Limiting** - Protect against abuse

**Estimated Time:** 1-2 weeks

---

## 🌐 Deployment Options

### Option 1: Cloud Platform (Recommended)

#### **A. AWS (Amazon Web Services)**
**Best for:** Scalability, enterprise-grade

**Architecture:**
```
Frontend (React) → CloudFront CDN → S3 Bucket
Backend (Node.js) → EC2 / ECS / Elastic Beanstalk
Socket.IO → EC2 / ECS with Load Balancer
Database → RDS MySQL
Game State → ElastiCache (Redis)
File Storage → S3 Bucket
```

**Cost:** ~$50-200/month (depending on traffic)

**Setup Steps:**
1. Create RDS MySQL instance
2. Deploy backend to EC2/ECS
3. Set up ElastiCache Redis
4. Deploy frontend to S3 + CloudFront
5. Configure Load Balancer for Socket.IO
6. Set up environment variables in AWS Systems Manager

---

#### **B. Heroku (Easiest)**
**Best for:** Quick deployment, small to medium scale

**Architecture:**
```
Frontend → Heroku (or Netlify/Vercel)
Backend → Heroku Dyno
Socket.IO → Heroku Dyno (same as backend)
Database → Heroku Postgres (or external MySQL)
Game State → Heroku Redis
File Storage → AWS S3 / Cloudinary
```

**Cost:** ~$25-100/month

**Setup Steps:**
1. Create Heroku app
2. Add Heroku Postgres addon (or connect external MySQL)
3. Add Heroku Redis addon
4. Deploy backend with `git push heroku main`
5. Deploy frontend to Netlify/Vercel
6. Configure environment variables in Heroku dashboard

**Pros:**
- Easy deployment
- Automatic SSL
- Built-in monitoring
- Easy scaling

**Cons:**
- More expensive at scale
- Less control

---

#### **C. DigitalOcean (Cost-Effective)**
**Best for:** Budget-conscious, good performance

**Architecture:**
```
Frontend → DigitalOcean App Platform / Spaces
Backend → Droplet (VPS)
Socket.IO → Same Droplet
Database → Managed MySQL Database
Game State → Managed Redis
File Storage → Spaces (S3-compatible)
```

**Cost:** ~$20-80/month

**Setup Steps:**
1. Create Droplet (Ubuntu 22.04)
2. Set up managed MySQL database
3. Set up managed Redis
4. Install Node.js, PM2
5. Deploy backend with PM2
6. Deploy frontend to App Platform
7. Configure Nginx reverse proxy

**Pros:**
- Very cost-effective
- Good performance
- Full control
- Simple pricing

---

#### **D. Vercel + Railway / Render (Modern Stack)**
**Best for:** Modern development workflow

**Architecture:**
```
Frontend → Vercel (automatic deployments)
Backend → Railway / Render
Socket.IO → Railway / Render
Database → Railway / Render PostgreSQL
Game State → Upstash Redis (serverless)
File Storage → Cloudinary / AWS S3
```

**Cost:** ~$20-60/month

**Pros:**
- Automatic deployments from Git
- Great developer experience
- Modern infrastructure
- Easy scaling

---

### Option 2: VPS (Virtual Private Server)

**Providers:** Linode, Vultr, Contabo, Hetzner

**Setup:**
1. Install Node.js, MySQL, Redis, Nginx
2. Use PM2 for process management
3. Set up SSL with Let's Encrypt
4. Configure firewall
5. Set up automated backups

**Cost:** ~$5-40/month

---

## 📦 Required Infrastructure Components

### 1. **Database (MySQL)**
- **Production:** Managed database service (RDS, Heroku Postgres, DigitalOcean)
- **Backup:** Automated daily backups
- **Monitoring:** Query performance, connection pool

### 2. **Redis (Game State)**
- **Purpose:** Store active game sessions
- **Options:** 
  - ElastiCache (AWS)
  - Heroku Redis
  - Upstash (serverless)
  - Managed Redis (DigitalOcean)

### 3. **File Storage**
- **Current:** Local filesystem (NOT production-ready)
- **Recommended:** 
  - AWS S3 + CloudFront
  - Cloudinary (image optimization)
  - DigitalOcean Spaces

### 4. **CDN (Content Delivery Network)**
- **Frontend:** CloudFront, Cloudflare, Vercel Edge
- **Static Assets:** Images, fonts, etc.

### 5. **Load Balancer**
- **Needed for:** Multiple backend instances
- **Socket.IO:** Requires sticky sessions or Redis adapter

### 6. **SSL Certificate**
- **Free:** Let's Encrypt
- **Auto-renewal:** Certbot

### 7. **Monitoring & Logging**
- **Application:** New Relic, Datadog, Sentry
- **Uptime:** UptimeRobot, Pingdom
- **Logs:** CloudWatch, Papertrail, Logtail

---

## 💳 Payment Integration

### Payment Gateway Options

#### **1. Stripe (Recommended for International)**
**Best for:** Global payments, credit cards, modern UX

**Features:**
- Credit/Debit cards
- Apple Pay, Google Pay
- Subscription support
- Strong fraud protection
- Great documentation

**Integration:**
```bash
npm install stripe
```

**Use Cases:**
- Buy in-game currency (bounty)
- Premium features
- Tournament entry fees
- Subscription plans

**Cost:** 2.9% + $0.30 per transaction

**Setup:**
1. Create Stripe account
2. Get API keys (test & live)
3. Install Stripe SDK
4. Create payment endpoints
5. Implement webhook for payment confirmation

---

#### **2. PayPal**
**Best for:** User trust, alternative payment method

**Features:**
- PayPal accounts
- Credit cards
- Buy Now, Pay Later
- International support

**Integration:**
```bash
npm install @paypal/checkout-server-sdk
```

**Cost:** 2.9% + fixed fee (varies by country)

---

#### **3. Razorpay (India)**
**Best for:** Indian market

**Features:**
- UPI, Netbanking, Wallets
- Cards
- Local payment methods

**Cost:** 2% per transaction

---

#### **4. Square**
**Best for:** US market, simple integration

**Cost:** 2.6% + $0.10 per transaction

---

### Payment Flow Architecture

```
User clicks "Buy Bounty" 
  → Frontend calls /api/payments/create-intent
  → Backend creates payment intent with Stripe
  → Frontend redirects to Stripe Checkout
  → User completes payment
  → Stripe sends webhook to /api/payments/webhook
  → Backend verifies payment
  → Backend updates user bounty in database
  → Backend notifies user via Socket.IO
```

### Payment Features to Implement

1. **Buy Bounty (In-Game Currency)**
   - Packages: $5 = 1000 bounty, $10 = 2500 bounty, etc.
   - Bonus: "Buy $20, get 10% extra!"

2. **Tournament Entry Fees**
   - Premium tournaments with higher stakes
   - Entry fee deducted from bounty

3. **Premium Features**
   - Ad-free experience
   - Custom avatars
   - Priority matchmaking
   - Statistics dashboard

4. **Subscription Plans**
   - Monthly premium membership
   - Recurring payments

---

## 🔧 Production Configuration Checklist

### Backend Configuration

#### 1. **Environment Variables (.env)**
```env
# Server
NODE_ENV=production
PORT=8050
SOCKET_PORT=5050

# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=your-db-name
DB_PORT=3306

# JWT
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
JWT_EXPIRES_IN=10800

# URLs
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
SOCKET_URL=https://socket.yourdomain.com

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2. **Process Manager (PM2)**
```bash
npm install -g pm2
pm2 start server.js --name luckyman-api
pm2 startup
pm2 save
```

#### 3. **Reverse Proxy (Nginx)**
```nginx
# /etc/nginx/sites-available/luckyman
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. **Socket.IO Configuration**
```javascript
// For production with multiple instances
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  },
  adapter: require("socket.io-redis")({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  })
});
```

---

### Frontend Configuration

#### 1. **Environment Variables (.env.production)**
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://socket.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### 2. **Build Optimization**
```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'"
  }
}
```

#### 3. **CDN Configuration**
- Serve static assets from CDN
- Enable gzip compression
- Set proper cache headers

---

## 📋 Pre-Launch Checklist

### Security
- [ ] All SQL queries use parameterized statements
- [ ] Passwords are hashed with bcrypt
- [ ] JWT secret in environment variable
- [ ] Input validation on all endpoints
- [ ] File upload validation
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS/SSL enabled
- [ ] Security headers set (Helmet.js)
- [ ] Database credentials secured
- [ ] API keys in environment variables

### Infrastructure
- [ ] Database backups configured
- [ ] Redis configured for game state
- [ ] File storage migrated to cloud
- [ ] CDN configured
- [ ] Load balancer set up (if needed)
- [ ] Monitoring and logging set up
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring

### Application
- [ ] All dependencies updated
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Game state persistence working
- [ ] Socket.IO scaling tested
- [ ] Payment integration tested
- [ ] Error handling improved
- [ ] Logging implemented

### Testing
- [ ] Load testing completed
- [ ] Security testing (OWASP)
- [ ] Payment flow tested
- [ ] Game flow tested
- [ ] Multi-user testing
- [ ] Mobile responsiveness

### Documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] Environment setup guide
- [ ] Payment integration docs
- [ ] Troubleshooting guide

---

## 🎯 Recommended Deployment Timeline

### Week 1-2: Security Fixes
- Fix SQL injection
- Implement password hashing
- Add input validation
- Secure file uploads

### Week 3: Infrastructure Setup
- Set up cloud database
- Configure Redis
- Set up file storage (S3/Cloudinary)
- Configure CDN

### Week 4: Payment Integration
- Choose payment gateway
- Implement payment endpoints
- Test payment flow
- Set up webhooks

### Week 5: Deployment
- Deploy to staging environment
- Test all features
- Performance testing
- Security audit

### Week 6: Production Launch
- Deploy to production
- Monitor closely
- Fix any issues
- Gather user feedback

---

## 💰 Estimated Costs

### Small Scale (100-500 users)
- Hosting: $20-50/month
- Database: $10-25/month
- Redis: $5-15/month
- CDN: $5-10/month
- **Total: ~$40-100/month**

### Medium Scale (500-5000 users)
- Hosting: $50-150/month
- Database: $25-75/month
- Redis: $15-40/month
- CDN: $10-30/month
- Monitoring: $10-25/month
- **Total: ~$110-320/month**

### Large Scale (5000+ users)
- Hosting: $150-500/month
- Database: $75-300/month
- Redis: $40-150/month
- CDN: $30-100/month
- Monitoring: $25-100/month
- **Total: ~$320-1150/month**

**Payment Processing:** Additional 2-3% of transaction volume

---

## 🔐 Security Best Practices for Production

1. **Never commit secrets to Git**
   - Use `.gitignore` for `.env` files
   - Use secret management (AWS Secrets Manager, etc.)

2. **Use HTTPS everywhere**
   - SSL certificates for all domains
   - Redirect HTTP to HTTPS

3. **Implement security headers**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

4. **Regular security audits**
   - Run `npm audit`
   - Use Snyk or Dependabot
   - Regular penetration testing

5. **Monitor for attacks**
   - Failed login attempts
   - Unusual API usage
   - Payment fraud patterns

---

## 📞 Support & Maintenance

### Monitoring Tools
- **Application:** New Relic, Datadog, AppDynamics
- **Errors:** Sentry, Rollbar
- **Uptime:** UptimeRobot, Pingdom
- **Logs:** Papertrail, Logtail, CloudWatch

### Backup Strategy
- **Database:** Daily automated backups
- **Files:** S3 versioning enabled
- **Game State:** Redis persistence
- **Test Restores:** Monthly restore tests

### Update Strategy
- **Dependencies:** Weekly security updates
- **Application:** Monthly feature updates
- **Database:** Quarterly schema updates
- **Infrastructure:** As needed

---

## 🚨 Common Production Issues & Solutions

### Issue 1: Socket.IO Not Working Across Instances
**Solution:** Use Redis adapter for Socket.IO

### Issue 2: Database Connection Limits
**Solution:** Use connection pooling, increase pool size

### Issue 3: Memory Leaks
**Solution:** Use PM2 with auto-restart, monitor memory usage

### Issue 4: Slow Response Times
**Solution:** Add caching, optimize queries, use CDN

### Issue 5: Payment Webhooks Not Received
**Solution:** Use ngrok for testing, verify webhook signature

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Socket.IO Scaling Guide](https://socket.io/docs/v4/using-multiple-nodes/)
- [Node.js Production Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Next Steps:**
1. Review and prioritize security fixes
2. Choose deployment platform
3. Set up staging environment
4. Implement payment integration
5. Deploy to production

