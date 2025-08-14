# LinkedIn Posts AI Agent Frontend

This is the Next.js (React/TypeScript) frontend for the LinkedIn Posts AI Agent project.

## Features
- Modern, responsive dashboard UI
- LinkedIn OAuth integration
- AI-powered post generation and optimization
- Content calendar and scheduling
- Analytics dashboard

## Getting Started

1. Navigate to the frontend directory:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Copy `.env.example` to `.env` and set `NEXT_PUBLIC_BACKEND_URL` to your backend URL (e.g., `http://localhost:8000`).
4. Start the development server:
	```sh
	npm run dev
	```

## Project Structure
```
frontend/
├── app/                # Main app code (pages, components)
├── public/             # Static assets
├── package.json        # NPM dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind CSS config
├── postcss.config.mjs  # PostCSS config
└── ...
```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint code

## Notes
- Do not commit `.env` files or `node_modules`.
- Make sure your backend is running and accessible at the URL set in `NEXT_PUBLIC_BACKEND_URL`.

---

For full-stack setup, see the main project [README](../README.md).
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

