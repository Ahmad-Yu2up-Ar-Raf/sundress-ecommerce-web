# 🛍️ Sundress

> **Multi-vendor e-commerce platform for local fashion brands with integrated Stripe payments**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)

---

## 📖 Overview

**Sundress** is a modern marketplace platform that empowers local fashion vendors to reach global buyers. Built with cutting-edge technologies, the platform provides seamless multi-vendor management, secure payment processing, and an intuitive user experience.

### ✨ Core Features

- 🏪 **Multi-Vendor Stores** — Independent vendor dashboards with full product control
- 📦 **Product Management** — Rich product listings with images, categories, and inventory tracking
- 🛒 **Shopping Experience** — Cart, wishlist, and streamlined checkout flow
- 💳 **Stripe Integration** — Secure payments with webhook automation
- 💰 **Commission System** — Automated platform & payment fee calculations
- ⭐ **Review System** — Customer reviews with media uploads
- 📊 **Analytics Dashboard** — Sales reports and performance metrics
- 🔄 **Order Tracking** — Real-time order status updates
- 🌐 **International Ready** — USD-based pricing with global shipping support

---

## 🚀 Tech Stack

### Backend
- ![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white) **Laravel 12** — PHP framework for web artisans
- ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white) **PHP 8.2+** — Modern PHP with performance & type safety
- ![Composer](https://img.shields.io/badge/Composer-885630?style=flat-square&logo=composer&logoColor=white) **Composer** — Dependency management
- ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white) **MySQL** / ![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) **PostgreSQL** — Relational database
- 🔐 **Spatie Laravel Permission** — Role-based access control

### Frontend
- ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black) **React 18** — UI library with hooks
- ![Inertia](https://img.shields.io/badge/Inertia.js-9553E9?style=flat-square&logo=inertia&logoColor=white) **Inertia.js** — Modern monolith architecture
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) **Vite** — Lightning-fast build tool
- ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) **Tailwind CSS** — Utility-first styling
- ![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white) **Node.js 18+** — JavaScript runtime

### Payment & Infrastructure
- ![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white) **Stripe** — Payment gateway (USD transactions)
- ![Stripe CLI](https://img.shields.io/badge/Stripe_CLI-635BFF?style=flat-square&logo=stripe&logoColor=white) **Stripe CLI** — Local webhook testing
- 🔄 **Stripe Connect** — Future support for vendor payouts

> **Note:** Redis is **NOT required** for development (optional for production caching/sessions)

---

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have:

- ✅ **PHP 8.2+** with extensions: `mbstring`, `pdo_mysql`, `curl`, `xml`, `zip`
- ✅ **Composer** (latest version)
- ✅ **Node.js 18+** and npm/yarn
- ✅ **MySQL 8.0+** or PostgreSQL 13+
- ✅ **Git** for version control

---

### 📥 Step 1: Clone Repository

```bash
git clone https://github.com/your-org/sundress.git
cd sundress
```

---

### 🔧 Step 2: Backend Setup

**Install PHP Dependencies:**
```bash
composer install
```

**Environment Configuration:**
```bash
cp .env.example .env
php artisan key:generate
```

**Configure Database** (edit `.env`):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sundress
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Run Migrations & Seeders:**
```bash
php artisan migrate --seed
php artisan storage:link
```

> 💡 **Tip:** Seeder creates default test accounts (see Quick Start section)

---

### 🎨 Step 3: Frontend Setup

**Install Node Dependencies:**
```bash
npm install
# or with yarn
yarn install
```

**Start Development Server:**
```bash
npm run dev
# or with yarn
yarn dev
```

> ⚡ Vite will compile assets and enable hot-reload at `http://localhost:5173`

---

### 🚀 Step 4: Run Application

Open a new terminal and start Laravel server:

```bash
php artisan serve --port=8000
```

Your app is now running at: **http://localhost:8000** 🎉

---

### 💳 Step 5: Stripe Configuration

#### 5.1 Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Activate **Test Mode** (toggle in top-right corner)
3. Navigate to: **Dashboard → Developers → API keys**

#### 5.2 Add Stripe Keys to `.env`

```env
STRIPE_KEY=pk_test_51xxxxxxxxxxxxx
STRIPE_SECRET=sk_test_51xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
STRIPE_CLIENT_ID=ca_xxxxxxxxxxxxxx
```

> 🔑 Get keys from: [Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)

#### 5.3 Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux (curl):**
```bash
curl -Ls https://stripe.com/install.sh | sudo bash
```

**Windows:**
1. Download `stripe.exe` from [GitHub Releases](https://github.com/stripe/stripe-cli/releases)
2. Add to system PATH
3. Verify installation: `stripe --version`

#### 5.4 Setup Webhooks (Local Development)

**Login to Stripe CLI:**
```bash
stripe login
```

**Start Webhook Listener:**
```bash
stripe listen --forward-to http://localhost:8000/api/webhooks/stripe
```

**Copy Webhook Secret:**
```
⚡ Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxx
```

Paste this secret into your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx
```

> 🎯 **Keep this terminal running** — it forwards Stripe events to your local app

---

## 📋 Environment Variables Reference

Complete `.env` configuration example:

```env
# Application
APP_NAME=Sundress
APP_ENV=local
APP_KEY=base64:xxxxxxxxxxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sundress
DB_USERNAME=root
DB_PASSWORD=

# Stripe Payment Gateway
STRIPE_KEY=pk_test_51xxxxxxxxxxxxx
STRIPE_SECRET=sk_test_51xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
STRIPE_CLIENT_ID=ca_xxxxxxxxxxxxxx

# Commission Settings (percentage)
WEBSITE_COMMISSION=10
STRIPE_COMMISSION=3

# Stripe Minimum Charge (in cents)
STRIPE_MINIMUM_USD_CENTS=50

# Mail (optional for local dev)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

---

## ⚡ Quick Start (TL;DR)

```bash
# 1️⃣ Clone & Install
git clone https://github.com/your-org/sundress.git
cd sundress
composer install
npm install

# 2️⃣ Configure
cp .env.example .env
php artisan key:generate
# Edit .env with your database & Stripe credentials

# 3️⃣ Migrate Database
php artisan migrate --seed
php artisan storage:link

# 4️⃣ Run Servers (3 terminals)
# Terminal 1: Backend
php artisan serve --port=8000

# Terminal 2: Frontend
npm run dev

# Terminal 3: Stripe Webhooks
stripe login
stripe listen --forward-to http://localhost:8000/api/webhooks/stripe
```

**Access:** http://localhost:8000 🚀

---

## 👤 Default Test Accounts

After running `php artisan migrate --seed`, these accounts are available:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| 🛡️ **Admin** | `admin@sundress.com` | `password` | Full platform access |
| 🏪 **Vendor** | `vendor@sundress.com` | `password` | Vendor dashboard & product management |
| 🛒 **Buyer** | `buyer@sundress.com` | `password` | Shopping & order tracking |

---

## 💳 Stripe Test Cards

Use these cards in **Test Mode** for testing payments:

| Card Number | Type | Expected Result |
|-------------|------|-----------------|
| `4242 4242 4242 4242` | Visa | ✅ **Payment succeeds** |
| `4000 0000 0000 0002` | Visa | ❌ **Card declined** |
| `4000 0000 0000 9995` | Visa | ⏱️ **Insufficient funds** |
| `4000 0025 0000 3155` | Visa | 🔐 **Requires authentication (3D Secure)** |

- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

📚 More test cards: [Stripe Testing Docs](https://stripe.com/docs/testing)

---

## 📂 Project Structure

```
sundress/
├── app/
│   ├── Enums/              # Status enums (Order, Product, etc.)
│   ├── Http/
│   │   ├── Controllers/    # API & web controllers
│   │   └── Middleware/     # Custom middleware
│   ├── Models/             # Eloquent models
│   └── Services/           # Business logic services
├── database/
│   ├── migrations/         # Database schema
│   └── seeders/            # Test data seeders
├── resources/
│   ├── js/
│   │   ├── Components/     # React components
│   │   ├── Layouts/        # Page layouts
│   │   └── Pages/          # Inertia pages
│   └── views/              # Blade templates
├── routes/
│   ├── web.php            # Web routes
│   └── api.php            # API routes
├── public/                # Public assets
└── storage/               # Uploaded files & logs
```

---

## 🔒 Security Notes

### Payment Processing
- ✅ **Server-side validation** — All price calculations happen server-side
- ✅ **Stripe cents conversion** — `amount * 100` for Stripe API
- ✅ **Webhook signature verification** — Validates requests from Stripe
- ✅ **Minimum charge validation** — Enforces Stripe's $0.50 minimum

### Best Practices
- 🔐 Never expose `STRIPE_SECRET` in client-side code
- 🔐 Validate webhook signatures before processing events
- 🔐 Use environment variables for all sensitive data
- 🔐 Enable HTTPS in production

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Generate production app key: `php artisan key:generate --force`
- [ ] Configure production database credentials
- [ ] Switch Stripe to **Live Mode** (update keys in `.env`)
- [ ] Setup Stripe webhook endpoint in dashboard
- [ ] Enable Redis for cache/sessions (optional but recommended)
- [ ] Configure email service (SendGrid, Mailgun, etc.)
- [ ] Setup SSL certificate (Let's Encrypt via Certbot)
- [ ] Optimize application: `php artisan optimize`
- [ ] Build production assets: `npm run build`

### Stripe Webhook Setup (Production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy **Signing Secret** to `STRIPE_WEBHOOK_SECRET` in production `.env`

---

## 📚 Additional Resources

- 📖 [Laravel Documentation](https://laravel.com/docs)
- ⚛️ [React Documentation](https://react.dev)
- 🔗 [Inertia.js Guide](https://inertiajs.com)
- 💳 [Stripe API Reference](https://stripe.com/docs/api)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

Need help? Reach out:

- 📧 Email: support@sundress.com
- 💬 Discord: [Join our server](https://discord.gg/sundress)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/sundress/issues)

---

<div align="center">

**Made with ❤️ by the Sundress Team**

⭐ Star us on GitHub — it helps!

</div>