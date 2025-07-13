# 🏁 Monorepo Starter - with/pocketbase

This is a GitHub template that aims to be a sort of "blueprint" for setting up a monorepo with [Turborepo](https://turbo.build/).<br />
If you find any issues or have suggestions, feel free to open an issue or a pull request.

> ⚠️ Keep in mind that this project is mainly structured for working with Docker.

> ℹ️ **Note:** You are viewing the documentation for a branch other than `main`. Some features or instructions may differ from the main version of the project.

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
- **Backend:** PocketBase (db management, auth, file storage, email sending)
- **Dev tools:** eslint, prettier, husky, lint-staged, commitlint
- **Deployment:** Docker
- **Env management:** dotenv

## 🗂️ Monorepo Structure

```
apps/
  web/              # SvelteKit app (posts example)
  api/              # API services (Hono)
packages/
  config/           # Shared configurations (eslint, tsconfig)
  backend/          # PocketBase instance
```

## 🧪 Usage

1. **Setup repository**
   - Click `use this template`, then **[create a new repository](https://github.com/new?template_name=monorepo-starter&template_owner=giovacalle)**, and clone it to your local machine
   - Run `pnpm install` to install dependencies

2. **Local development**
   - Start the single app(s):<br/>
     `pnpm dev:filter @monorepo-starter/web`<br/>
     `...`

   - With Docker (for local pocketbase instance):<br/>
     `pnpm docker-compose:up`

   > ℹ️ **Note:** In the root `package.json`, you will find several `utils` scripts to interact with the PocketBase instance running inside Docker. These scripts can help you perform common tasks such as migrations, seeding.

3. **Backend setup**

   [PocketBase](https://pocketbase.io/) is an open-source backend solution that provides a lightweight database, authentication, file storage, and real-time APIs. It is easy to run locally or in Docker, making it ideal for rapid prototyping and small-to-medium projects. PocketBase uses SQLite under the hood and exposes a REST API for integration with frontend apps.<br />

   To set up PocketBase, follow these steps:
   1. **Install PocketBase**<br/>
      You can run PocketBase in Docker or download the binary from the [PocketBase docs](https://pocketbase.io/docs/)...For simplicity, this project uses Docker to run PocketBase. (see the step above)<br/><br/>
   2. **Configure PocketBase**
   - There is `.env` file in in the `packages/backend` directory. You can set the environment variables for PocketBase here.
     We pre-configured some variables with dummy values, but you should change them according to your needs.
   - If you do not require an `.env.local` file, remove its reference from the `docker-compose.yml` in the root directory. Otherwise, Docker will throw an error when starting the container if the file is missing.<br/><br/>
   3. **Run PocketBase**<br/>
      If you are using Docker, you can run `pnpm docker-compose:up`

      #### 💡 Good to know

      Inside the `packages/backend` directory, you'll find two important folders:
      - **pb_migrations**: Contains JavaScript migration scripts to manage your database (collections, settings, etc.). In order to apply migrations, Pocketbase instance need to be restarted. (see step 3 above)
      - **pb_hooks**: Contains custom JavaScript hooks to extend server-side functionality. You'll notice that this folder is mounted as a volume in the Docker container, so you can edit the files directly and see the changes without restarting PocketBase.

      You will find some example already implemented (both in migrations and hooks), that I needed for a simple 'posts' project in the `apps/web` directory.

      > #### 📁 `pb_data` folder
      >
      > Another important folder is `pb_data`, which contains a `.gitkeep` file to ensure it is tracked by git even when empty. While this folder is **not** used as the actual PocketBase data directory (that is managed via a Docker volume in `docker-compose.yml`), it serves as a workspace for development files, such as generated type definitions. These types are useful for providing type safety in migration and hook scripts.
      >
      > You’ll also notice that `pb_data` is referenced in the `apps/web/package.json` to create a type-safe PocketBase client for SvelteKit, using [pocketbase-typegen](https://github.com/nhost/pocketbase-typegen). This approach helps maintain consistent types across your backend and frontend code.

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
      - Define the **Authorized redirect URIs** (`http://localhost:8080/api/oauth2-redirect`) (pocketbase route that handles the OAuth2 redirect).

   4. Insert the **Client ID** and **Client Secret** into the environment variables (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`) (in pocketbase env file).

5. **Email templates**

   In `packages/backend`, you can find an `email` folder that contains the email templates used for sending emails via PocketBase. These templates are written using [MJML](https://mjml.io/), a markup language designed for responsive email design.

   > **Note:** If you're using VS Code, check out the official `MJML extension` for live preview and editing of MJML email templates directly in your editor.

   Then in the `package.json` (of the `packages/backend`), you will find a script to compile the MJML templates into HTML:

   ```bash
   pnpm build:emails
   ```

   This script will compile the MJML templates into HTML files, which PocketBase will use to send emails. Automatically, the compiled HTML files will be placed in the `packages/backend/pb_hooks` directory.<br/>

   To allow injecting custom fields into the email templates, I have emulated PocketBase’s default HTML template syntax. This approach ensures compatibility with PocketBase’s rendering logic and makes it easy to use dynamic values in your emails. For reference, see the example for OTP verification in `packages/backend/pb_hooks/override_otp_mailer.pb.js`.  
   You can learn more about the template structure in the [PocketBase documentation](https://pocketbase.io/docs/js-rendering-templates/).

   > #### 🌐 Internationalization (i18n)
   >
   > To make email templates adaptable to multiple languages, I implemented a simple i18n mechanism using the HTML parser. This allows you to inject localized strings directly into your MJML templates, ensuring that emails can be tailored for different audiences. You can see a practical example of this approach in the `override_otp_mailer.pb.js`.

6. **Build and deploy**

   For this type of projects I really like to use [Railway](https://railway.app/), that is very integrated with Docker and GitHub CI/CD, but you can also use your preferred cloud provider.

## 📚 Resources

- [Turborepo with docker docs](https://turborepo.com/docs/guides/tools/docker)
- [Optimized Dockerfile with pnpm](https://fintlabs.medium.com/optimized-multi-stage-docker-builds-with-monorepo-and-pnpm-for-nodejs-microservices-in-a-monorepo-c686fdcf051f)
- [Pocketbase docs](https://pocketbase.io/docs/)
