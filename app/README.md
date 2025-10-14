# AI Law Junior (App)

This directory contains the Next.js `app` router for AI Law Junior.

## Prerequisites
- Node.js 18+
- pnpm, yarn, or npm

## Setup
```bash
# from repo root or this folder
pnpm install   # or: yarn install / npm install
```

## Development
```bash
pnpm dev       # or: yarn dev / npm run dev
```

## Build
```bash
pnpm build     # or: yarn build / npm run build
```

## Start (after build)
```bash
pnpm start     # or: yarn start / npm start
```

## Project Structure
This `app/` folder contains route segments like `about`, `dashboard`, `login`, `settings`, API routes in `api/`, and shared layout/styles.

## Environment Variables
Create `.env.local` for local secrets. Never commit `.env*` files; they are ignored via `.gitignore`.
