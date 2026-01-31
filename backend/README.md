# 🚀 Nexa - Backend

Nexa Backend is a powerful, scalable API built with **NestJS**, **GraphQL**, and **Prisma**. It serves as the core engine for the Nexa platform, handling everything from real-time streaming integration to complex payment processing and security.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **API**: [GraphQL](https://graphql.org/) with [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Caching & Sessions**: [Redis](https://redis.io/) via `ioredis` and `connect-redis`
- **Streaming**: [LiveKit Server SDK](https://livekit.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **Mailing**: [React Email](https://react.email/) with [Nodemailer](https://nodemailer.com/)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/) (or S3-compatible storage)
- **Security**: [Argon2](https://github.com/P-H-C/phc-winner-argon2) for hashing, [OTPAuth](https://github.com/hectorm/otpauth) for 2FA
- **Bot Integration**: [Telegraf](https://telegraf.js.org/) (Telegram Bot API)

---

## ✨ Core Modules

### 🔐 Authentication & Security

- **Session-based Auth**: Secure session management using Redis.
- **2FA (TOTP)**: Built-in two-factor authentication with QR code generation.
- **Account Management**: Registration, email verification, password recovery, and account deactivation.
- **Social Links**: Manage user social profiles with reordering capabilities.

### 📡 Streaming & Live

- **LiveKit Integration**: Token generation for participants and ingress management for streamers.
- **Webhooks**: Handling real-time events from LiveKit to update stream statuses.
- **Chat**: Real-time messaging using GraphQL Subscriptions.

### 💎 Sponsorship & Payments

- **Stripe Integration**: Processing payments for channel sponsorships.
- **Sponsorship Plans**: Streamers can create, manage, and delete custom sponsorship tiers.
- **Transactions**: Full history and tracking of all financial operations.

### 👥 Social Features

- **Follow System**: Robust follow/unfollow logic with real-time updates.
- **Notifications**: In-app and potentially email/telegram notifications for various events.
- **Categories**: Dynamic category management for content discovery.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v22 or higher)
- PostgreSQL
- Redis
- S3 Storage (AWS or MinIO)
- LiveKit Server

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (create `.env`):
   Check `src/core/config/` for required variables (DB URL, Redis, LiveKit, Stripe, AWS, etc.).

3. Database Setup:

   ```bash
   npx prisma generate
   npm run db:push
   ```

4. Start the server:

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

---

## 📂 Project Structure

- `src/core/`: Global configurations, database (Prisma), Redis, and shared middlewares.
- `src/modules/`:
  - `auth/`: Everything related to users, sessions, 2FA, and profiles.
  - `stream/`: LiveKit integration and stream management.
  - `chat/`: Real-time GraphQL subscriptions and message handling.
  - `sponsorship/`: Payments, plans, and subscriptions.
  - `libs/`: External service wrappers (Mail, Stripe, LiveKit, Telegram).
- `prisma/`: Database schema definition.

---

## 📜 Scripts

- `npm run start:dev`: Starts the server in watch mode.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run db:push`: Synchronizes the Prisma schema with the database.
- `npm run db:studio`: Opens a GUI to explore your database.
- `npm run lint`: Checks for code style issues.

---

## 📄 License

[UNLICENSED](LICENSE)
