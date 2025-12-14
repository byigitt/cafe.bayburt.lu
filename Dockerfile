FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g serve

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
