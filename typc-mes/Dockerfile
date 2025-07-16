FROM node:20.10 as builder

# pnpm 설치
RUN npm install -g pnpm@9.0.6

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN NEXT_PUBLIC_BACKEND_URL=https://lca-bknd-dev.e3view.com pnpm run build

FROM node:20.10

RUN npm install -g pnpm@9.0.6

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN pnpm install --prod

COPY --from=builder /usr/src/app .

EXPOSE 3000

CMD ["pnpm", "start"]