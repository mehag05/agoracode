# 🎓 Agora — Your Campus Marketplace

<div align="center">

[![Website](https://img.shields.io/badge/Website-shopatagora.com-blue?style=for-the-badge&logo=internet-explorer)](https://www.shopatagora.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.2%25-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

*A modern, full-stack peer-to-peer marketplace tailored for college campuses*

</div>

---

## 🌟 Overview

Agora empowers students to **buy and sell items** (books, clothes, dorm essentials, and more) within a **trusted, university-verified community**. Built with modern web technologies, Agora provides a seamless marketplace experience with secure payments, real-time notifications, and a mobile-first design.

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 **Authentication & Security**
- University-verified authentication flow
- SuperTokens integration
- Email verification system
- Secure user sessions

### 💰 **Payments & Commerce**
- Stripe Connect for seller payouts
- Full cart and checkout system
- Automated receipt generation
- Order tracking and management

</td>
<td width="50%">

### 📱 **User Experience**
- Fully responsive mobile layout
- Real-time notifications
- Product image uploads with previews
- Intuitive seller dashboard

### 📧 **Communication**
- Email verification flows
- Purchase receipts
- Order status reminders
- Automated notifications

</td>
</tr>
</table>

## 🛠️ Tech Stack

### **Frontend**
```
React + TypeScript    │ Component-based UI framework
TailwindCSS          │ Utility-first CSS framework
SuperTokens          │ Authentication solution
Axios               │ HTTP client for API calls
```

### **Backend**
```
Node.js + Express    │ Server runtime and web framework
TypeScript          │ Type-safe JavaScript
PostgreSQL          │ Relational database
Stripe API          │ Payment processing & Connect
AWS S3              │ Media storage and uploads
Nodemailer          │ Email delivery system
React Email         │ Email template rendering
```

### **Development Tools**
```
ESLint              │ Code linting and formatting
ts-node             │ TypeScript execution
nodemon             │ Development server hot-reload
npm workspaces      │ Monorepo management
```

## 📁 Project Structure

```
mehag05-agoracode/
├── 📂 backend/                 # Express API server
│   ├── 🔌 routes/             # API endpoints
│   ├── 🗄️  models/            # Database models
│   ├── 🛠️  middleware/        # Custom middleware
│   └── 📧 services/           # Email, Stripe, AWS services
├── 📂 frontend/               # React application
│   ├── 🧩 components/         # Reusable UI components
│   ├── 📄 pages/              # Application pages
│   ├── 🎨 styles/             # Tailwind configurations
│   └── 🔧 utils/              # Helper functions
├── 📦 package.json            # Root package configuration
└── 📖 README.md               # Project documentation
```

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/agora.git
cd mehag05-agoracode
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Configuration**

Create the following environment files:

#### **Backend** (`/backend/.env`)
```env
# Database
MONGODB_URI=your_mongodb_connection_string
DB_NAME=agora_db
PORT=3001

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-west-1
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Service
RESEND_API_KEY=your_resend_api_key

# Authentication
SUPERTOKENS_API_KEY=your_supertokens_api_key

# Application URLs
WEBSITE_URL=http://localhost:3000
API_URL=http://localhost:3001

# Document Conversion
CONVERTAPI_SECRET_KEY=your_convertapi_key
```

#### **Frontend** (`/frontend/.env`)
```env
# Build Configuration
SKIP_PREFLIGHT_CHECK=true

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_BASE_URL=http://localhost:3000

# Payment Processing
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Database (if needed for client-side operations)
MONGODB_URI=your_mongodb_connection_string
DB_NAME=agora_db
```

### 4. **Launch the Application**
```bash
npm run dev
```

🎉 **That's it!** Your Agora marketplace should now be running at `http://localhost:3000`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Runs frontend and backend in development mode |
| `npm run build` | 🏗️ Builds both frontend & backend for production |
| `npm run lint` | 🔍 Runs ESLint on all project files |
| `npm start` | ⚡ Runs frontend + backend in production mode |

## 🤝 Contributing

We welcome contributions to make Agora even better! Please feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📞 Support

Having issues?

- 🌐 **Website**: [shopatagora.com](https://www.shopatagora.com)
- 📧 **Email**: agoraupenn@gmail.com

---

<div align="center">

**Made with ❤️ for college students everywhere**

*Empowering campus communities through trusted peer-to-peer commerce*

</div>
