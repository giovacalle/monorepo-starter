FROM node:23-slim AS slim
ENV TURBO_TELEMETRY_DISABLED=1

FROM slim AS base
RUN npm install pnpm@10.6.5 turbo@^2 --global
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS pruner
WORKDIR /app

COPY . .
RUN turbo prune --scope=@monorepo-starter/web --docker

FROM base AS builder
WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=@monorepo-starter/web
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional

FROM slim AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte
USER svelte

WORKDIR /app
COPY --from=builder --chown=svelte:nodejs /app .

WORKDIR /app/apps/web

ARG PORT
EXPOSE ${PORT}

CMD ["node", "build"]