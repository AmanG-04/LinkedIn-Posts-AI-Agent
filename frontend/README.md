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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
