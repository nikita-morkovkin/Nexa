# 📺 Nexa - Frontend

Nexa is a modern, high-performance streaming platform built with **Next.js**, **TypeScript**, and **GraphQL**. It provides a seamless experience for both streamers and viewers, featuring real-time chat, interactive streaming, and a robust user management system.

---

## ✨ Features

- **📡 Live Streaming**: Integrated with **LiveKit** for low-latency video delivery and management.
- **💬 Real-time Chat**: Interactive live chat with emoji support, moderation tools, and instant message delivery via GraphQL subscriptions.
- **🔐 Secure Authentication**: Full auth flow including Login, Registration, Password Recovery, and **2FA (TOTP)**.
- **👤 User Profiles**: Customizable profiles with avatars, social links, and appearance settings (Dark/Light/System themes).
- **📊 Streamer Dashboard**: Comprehensive tools for managing streams, viewing followers, tracking transactions, and configuring sponsorship plans.
- **💎 Sponsorship System**: Create and manage sponsorship tiers, handle payments, and reward loyal viewers.
- **🔍 Discovery**: Browse by categories, view recommended channels, and discover new streams through a dynamic home page.
- **🌍 Internationalization**: Multi-language support out of the box.

---

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)

### UI Components

- **Base Components**: [Radix UI](https://www.radix-ui.com/)
- **Tables**: [TanStack Table](https://tanstack.com/table/v8)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Streaming & Real-time

- **Video**: [LiveKit React Components](https://docs.livekit.io/reference/components/react/)
- **Real-time**: GraphQL Subscriptions via WebSockets

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- A running backend (NestJS)
- LiveKit server (or Cloud account)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (create `.env.local`):

   ```env
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
   NEXT_PUBLIC_LIVEKIT_WS_URL=wss://your-livekit-url
   ```

3. Generate GraphQL types:

   ```bash
   npm run codegen
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`:
  - `features/`: Complex components grouped by domain (auth, chat, stream, user).
  - `layouts/`: Shared layout elements like Header and Sidebar.
  - `ui/`: Reusable primitive components (Shadcn-like).
- `config/`: Configuration for i18n and other services.
- `graphql/`: GraphQL operations (queries, mutations, subscriptions) and generated types.
- `providers/`: Context providers (Apollo, Theme).
- `public/`: Static assets.

---

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run codegen`: Generates TypeScript types from GraphQL schema and operations.

---

## 🤝 Contributing

This project is part of the Nexa ecosystem. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
