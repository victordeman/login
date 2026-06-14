# Secure QR Login System

A professional Next.js application demonstrating a secure, ephemeral QR code login flow. Built with the Next.js App Router, Prisma ORM, and Redis for session management.

## Features

- **Secure QR Login**: Ephemeral tokens with browser context binding (User-Agent) to prevent session hijacking.
- **Role-Based Access Control**: Separate routes for users and administrators.
- **Ephemeral Token Management**: Fast, temporary storage in Redis for login tokens.
- **Professional UI**: Built with Tailwind CSS, shadcn/ui, and Lucide icons.
- **Robust Security**: Rate limiting, single-use tokens, and secure session management with `jose`.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache/Storage**: Redis (Upstash)
- **Auth**: JWT-based sessions (`jose`)
- **UI Components**: shadcn/ui & Tailwind CSS

## Prerequisites

- **Node.js**: 18.x or higher
- **PostgreSQL**: A running instance (local or hosted)
- **Redis**: An Upstash account or a local Redis server

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/victordeman/login.git
cd login
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your credentials.
```bash
cp .env.example .env
```
Ensure you provide:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `UPSTASH_REDIS_REST_URL`: Your Upstash Redis URL (or local proxy).
- `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis token.
- `SESSION_SECRET`: A secure string for JWT signing.

### 4. Database Initialization
Generate the Prisma client and push the schema to your database.
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the Database
Create test admin and user accounts.
```bash
npm run prisma db seed
```
Test accounts created:
- **Admin**: `admin@example.com` (Password: `admin123`)
- **User**: `user@example.com` (Password: `user123`)

### 6. Run the Application
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Local Redis Setup (Alternative to Upstash)

If you prefer to run Redis locally instead of using Upstash:
1. Start Redis locally (e.g., via Docker: `docker run -d -p 6379:6379 redis`).
2. Use a proxy or update `lib/redis.ts` to use a standard Redis client instead of `@upstash/redis` (which uses HTTP).
3. For ease of use, we recommend the free tier of [Upstash](https://upstash.com/).

## Deployment

This app can be deployed on Vercel or any Node.js environment. Ensure all environment variables are correctly configured in your production dashboard.

## License

MIT
