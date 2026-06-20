# Deployment Guide

This guide provides step-by-step instructions for deploying this Next.js application to **Vercel** with **Neon** (PostgreSQL) and **Upstash** (Redis).

## A. Recommended Production Database: Neon

We recommend using **[Neon](https://neon.tech)** as the PostgreSQL database for Vercel. Neon is a serverless PostgreSQL database that offers excellent Prisma support and built-in connection pooling, which is essential for serverless environments like Vercel.

## B. Step-by-step Neon Setup Instructions

1.  Go to [https://neon.tech](https://neon.tech) and sign up / log in (you can use GitHub or email).
2.  Click on **"Create a Project"**.
3.  Give your project a name (e.g., `login-app-production`).
4.  Select a region closest to your users (recommended: `US East (Ohio)` or `EU Central (Frankfurt)`).
5.  Click **Create Project**.
6.  On the project dashboard, go to the **Connection Details** section.
7.  Copy the **Connection string** (this will be your `DATABASE_URL`).
8.  (Recommended) **Enable Connection Pooling**:
    - Go to **Settings** → **Connection Pooling**.
    - Enable it and copy the **Pooled connection string** (usually ends with `-pooler`).
9.  Paste the connection string into your Vercel environment variables as `DATABASE_URL`.

## C. Required Environment Variables for Vercel

The following environment variables must be configured in Vercel for the application to function correctly:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your Neon PostgreSQL connection string (use the **pooled** version). |
| `UPSTASH_REDIS_REST_URL` | The REST URL from your Upstash Redis dashboard. |
| `UPSTASH_REDIS_REST_TOKEN` | The REST Token from your Upstash Redis dashboard. |
| `SESSION_SECRET` | A strong random string used to sign session JWTs (minimum 32 characters). |

> **Tip:** You can generate a `SESSION_SECRET` using: `openssl rand -base64 32`

## D. How to Add Environment Variables in Vercel

1.  Navigate to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Go to **Settings** → **Environment Variables**.
3.  Add each variable listed above.
4.  Ensure they are applied to all environments: **Production**, **Preview**, and **Development**.

## E. Post-Deployment Steps

### 1. Run Database Migrations
After the first deployment, you need to push your Prisma schema to the production database:
```bash
npx prisma db push
```
*Note: You may need to run this from your local machine with the production `DATABASE_URL` in your `.env` file, or use a GitHub Action.*

### 2. Seed the Database
To create the initial admin and user accounts:
```bash
npx prisma db seed
```
*This will create:*
- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

### 3. Verify the Deployment
- Visit your Vercel deployment URL.
- Try logging in with the seeded credentials.
- Test the QR login flow to ensure Redis and the database are correctly connected.

## F. Important Notes

-   **Prisma in Serverless**: We use `@prisma/adapter-pg` with the `pg` library to manage connections efficiently in serverless functions.
-   **Connection Pooling**: Always use Neon's pooled connection string in production to prevent "too many connections" errors as your serverless functions scale.
-   **Cold Starts**: The first request after some inactivity might be slightly slower due to serverless cold starts and database connection initialization.
-   **Security**: Ensure your `SESSION_SECRET` is never committed to version control and is kept secure in Vercel.
