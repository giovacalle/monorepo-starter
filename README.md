# 🏁 Monorepo Starter

This is a GitHub template that aims to be a sort of "blueprint" for setting up a monorepo with [Turborepo](https://turbo.build/).<br />
If you find any issues or have suggestions, feel free to open an issue or a pull request.

> ⚠️ Keep in mind that this project is mainly structured for working with Docker.

## Table of contents

- 🏁 [Start](#🏁-monorepo-starter)
- 🛠 [Stack](#🛠-stack)
- 🗂️ [Monorepo Structure](#🗂️-monorepo-structure)
- 🧪 [Usage](#🧪-usage)
- 📚 [Resources](#📚-resources)

## 🛠 Stack

- **Monorepo:** Turborepo
- **Package manager:** pnpm
- **Frontend:** SvelteKit (TypeScript)
- **UI:** bits-ui, tailwindcss, iconify
- **API:** Hono (TypeScript, ESM), orval (openapi generator), tanstack-query
- **DB/ORM:** PostgreSQL, Drizzle ORM, Redis
- **Authentication:** better-auth (email OTP verification, Google OAuth)
- **Email:** react-email (+ Resend as email service)
- **Dev tools:** eslint, prettier, husky, lint-staged, commitlint
- **Deployment:** Docker
- **Env management:** dotenv

## 🗂️ Monorepo Structure

```
apps/
  web/              # SvelteKit app
  api/              # API services (Hono)
packages/
  config/           # Shared configurations (eslint, tsconfig)
  db/               # Drizzle schema and shared DB helpers
  openapi-client/   # API client generated with Orval
  transactional/    # Transactional email templates (react-email)
  ui/               # Shared UI components (bits-ui, svelte)
```

## 🧪 Usage

1. **Setup repository**
   - Click `use this template`, then **[create a new repository](https://github.com/new?template_name=monorepo-starter&template_owner=giovacalle)**, and clone it to your local machine
   - Run `pnpm install` to install dependencies

2. **Local development**
   - **Start individual apps:**

     ```bash
     # start web app
     pnpm dev --filter=@monorepo-starter/web

     # start API services
     pnpm dev --filter=@monorepo-starter/api-posts
     # p.s. you can also run all api services at once with:
     pnpm dev-all-apis
     ```

   - **Set up local database:**

     ```bash
     # start PostgreSQL in Docker
     pnpm docker-compose:up

     # Or with sample data initialization
     pnpm docker-compose:up --init-db
     ```

3. **Redis**
   - Install and run Redis locally or use a cloud provider (e.g., Redis Cloud, Upstash)
   - Add the Redis connection string to your environment variables:
     ```
     REDIS_URL=redis://localhost:6379
     # or for cloud Redis:
     REDIS_URL=redis://username:password@host:port
     ```

4. **Google OAuth**

   In order to use `Google OAuth`, you will need to:
   1. **Create a Google Cloud Project**
      - Go to the [Google Cloud Console](https://console.cloud.google.com/).
      - Create a new project or select an existing one.

   2. **Enable OAuth 2.0 API**
      - Navigate to the API & Services section.
      - Click on **Library** and search for "Google Identity Services".
      - Enable the **Google Identity Services API** for your project.

   3. **Create OAuth 2.0 Credentials**
      - Go to **APIs & Services** > **Credentials**.
      - Click on **Create Credentials** and select **OAuth 2.0 Client IDs**.
      - Choose the application type (e.g., Web application).
      - Define **Authorized JavaScript origins** (`http://localhost:5173`).
      - Define the **Authorized redirect URIs** (`http://localhost:4000/api/v1/callback/google`) (pocketbase route that handles the OAuth2 redirect).

   4. Insert the **Client ID** and **Client Secret** into the environment variables (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) (in pocketbase env file).

5. **Email templates**

   In `transactional` package, you can find the email templates built with [react-email](https://react.email/).
   For the sake of simplicity, Resend is used as the email service, but you can adapt it to your preferred service.

   In order to use [Resend](https://resend.com), you will need to:
   1. Create an account

   2. Define the domain from which to send emails (follow [Resend docs](https://resend.com/docs/dashboard/domains/introduction))

   3. Generate an API key and insert it into the `RESEND_API_KEY` env variable

   4. In the `FROM_EMAIL` env variable, insert the email address from which emails will be sent (in the templates you will see that the `from` field is optional, so you can customize it as needed. By default, it will use the `FROM_EMAIL` variable)

6. **Build and deploy**

   For this type of projects I really like to use [Railway](https://railway.app/), that is very integrated with Docker and GitHub CI/CD, but you can also use your preferred cloud provider.

## 📚 Resources

- [Turborepo with docker docs](https://turborepo.com/docs/guides/tools/docker)
- [Optimized Dockerfile with pnpm](https://fintlabs.medium.com/optimized-multi-stage-docker-builds-with-monorepo-and-pnpm-for-nodejs-microservices-in-a-monorepo-c686fdcf051f)
