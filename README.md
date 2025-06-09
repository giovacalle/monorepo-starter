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
- **DB/ORM:** PostgreSQL, Drizzle ORM
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
```

## 🧪 Usage

1. **Setup repository**

- Click `use this template`, then **[create a new repository](https://github.com/new?template_name=monorepo-starter&template_owner=giovacalle)**, and clone it to your local machine
- Run `pnpm install` to install dependencies

2. **Local development**

- Start the single app(s):  
  `pnpm dev:filter @monorepo-starter/web`<br />
  `pnpm dev:filter @monorepo-starter/api-services-todos`<br />
  `...`

  - With Docker (for local db instance)

    - Start Docker containers (there is a docker-compose.yml file in the root):
      `pnpm docker-compose:up`

      p.s.: you can also add `--init-db` to initialize the database with some fake data

3. **Build and deploy**

- For this type of projects I really like to use [Railway](https://railway.app/), that is very integrated with Docker and GitHub CI/CD, but you can also use your preferred cloud provider.

## 📚 Resources

- [Turborepo with docker docs](https://turborepo.com/docs/guides/tools/docker)
- [Optimized Dockerfile with pnpm](https://fintlabs.medium.com/optimized-multi-stage-docker-builds-with-monorepo-and-pnpm-for-nodejs-microservices-in-a-monorepo-c686fdcf051f)
