# 📺 Nexa - Fullstack Streaming Platform

Welcome to **Nexa**, a comprehensive, self-hosted streaming ecosystem. This project is a fullstack application designed to provide a high-performance streaming experience similar to Twitch or YouTube Live.

---

## 🏗️ Architecture

The project is split into two main parts:

### 🎨 [Frontend](./frontend/README.md)

A modern, responsive web application built with:

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Apollo Client** (GraphQL)
- **LiveKit React Components**

👉 [Learn more about the Frontend](./frontend/README.md)

### ⚙️ [Backend](./backend/README.md)

A robust, scalable API and orchestration layer built with:

- **NestJS**
- **GraphQL** (Apollo)
- **Prisma** (PostgreSQL)
- **Redis** (Sessions & Caching)
- **LiveKit Server SDK**
- **Stripe** (Payments)

👉 [Learn more about the Backend](./backend/README.md)

---

## 🌟 Key Features

- **📡 Low Latency Streaming**: Powered by LiveKit for professional-grade video delivery.
- **💬 Interactive Chat**: Real-time communication with emojis and moderation.
- **🔐 Enterprise-grade Security**: Session-based auth, 2FA (TOTP), and secure payment processing.
- **💎 Monetization**: Custom sponsorship plans and Stripe integration.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **🌍 Global Ready**: Built-in internationalization (i18n) and multi-language support.

---

## 🚀 Quick Start

To get the entire platform running locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/nikita-morkovkin/Nexa.git
   cd Nexa
   ```

2. **Setup the Backend**:
   - Follow the instructions in [backend/README.md](./backend/README.md#installation).
   - Ensure you have PostgreSQL, Redis, and a LiveKit server running.

3. **Setup the Frontend**:
   - Follow the instructions in [frontend/README.md](./frontend/README.md#installation).
   - Point the frontend to your local backend GraphQL endpoint.

---

## 🛠️ Requirements

- **Node.js**: v22+
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Streaming**: LiveKit Server
- **Storage**: S3 Compatible (AWS S3, MinIO, etc.)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
