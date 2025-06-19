Agora — Your Campus Marketplace
🌐 www.shopatagora.com

Agora is a modern, full-stack peer-to-peer marketplace tailored for college campuses. It empowers students to buy and sell items (books, clothes, dorm essentials, etc.) in a trusted, university-verified community. The platform includes features like Stripe Connect integration, real-time notifications, email verification, and a clean mobile-responsive UI powered by React and Tailwind.

🧱 Tech Stack
Frontend:

React + TypeScript

TailwindCSS

SuperTokens for auth

Axios for API calls

Backend:

Node.js + Express

TypeScript

PostgreSQL

Stripe API (Payments & Connect)

AWS S3 (Media Uploads)

Nodemailer + React Email

Dev Tools:

ESLint

ts-node

nodemon

npm workspaces

🚀 Features
🔐 University-verified authentication flow (SuperTokens)

💵 Stripe Connect for sellers to get paid

🛒 Cart, checkout, and receipt system

📧 Email flows: verification, receipts, reminders

🖼 Product uploads with image previews

📦 Seller dashboard with order management

📱 Fully responsive mobile layout

📁 Directory Structure

mehag05-agoracode/
├── backend/        # Express API server with Stripe, DB, Email logic
├── frontend/       # React app using Tailwind and custom UI components
├── package.json    # Root script hub for mono-repo
└── README.md       # This file
🛠️ Getting Started
1. Clone the repo
git clone https://github.com/yourusername/agora.git
cd mehag05-agoracode
2. Install dependencies
npm install
3. Environment setup
Create .env files for both frontend and backend. Include:

Backend (/backend/.env)

MONGODB_URI=
DB_NAME=
PORT=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-west-1
AWS_S3_BUCKET_NAME=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
SUPERTOKENS_API_KEY=

REACT_APP_STRIPE_PUBLISHABLE_KEY=
WEBSITE_URL=http://localhost:3000
API_URL=http://localhost:3001

CONVERTAPI_SECRET_KEY=

Frontend (/frontend/.env)

SKIP_PREFLIGHT_CHECK=true

REACT_APP_API_BASE_URL=http://localhost:3001

MONGODB_URI=
DB_NAME=

REACT_APP_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
REACT_APP_BASE_URL=http://localhost:3000

4. Run the app
npm run dev
🧪 Scripts
Script	What it does
npm run dev	Runs frontend and backend together
npm run build	Builds both frontend & backend
npm run lint	Runs ESLint on all files
npm start	Runs frontend + backend production
