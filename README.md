# LinkedIn Posts AI Agent

A full-stack AI-powered LinkedIn content manager with post generation, scheduling, analytics, and a modern dashboard UI.

## Features

- LinkedIn OAuth login and secure authentication
- AI-generated and optimized LinkedIn posts
- Persistent topic management and scheduling
- Content calendar with drag-and-drop scheduling
- Analytics dashboard for post performance
- Modern, responsive UI (Next.js + Tailwind CSS)
- FastAPI backend with MongoDB integration

## Project Structure

```
LinkedIn-Posts-AI-Agent/
├── backend/    # FastAPI backend (Python)
├── frontend/   # Next.js frontend (TypeScript/React)
├── README.md   # Project documentation
└── ...
```

## Getting Started


### 1. Backend Setup

1. Navigate to the backend folder:
	```sh
	cd backend
	```
2. Install Python dependencies:
	```sh
	pip install -r requirements.txt
	```
3. Create a `.env` file in the `backend/` directory. You can copy from `.env.example` if available:
	```sh
	cp .env.example .env
	# or create manually if not present
	```
	Add the following variables (example):
	```env
	MONGODB_URI=mongodb://localhost:27017
	LINKEDIN_CLIENT_ID=your_linkedin_client_id
	LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
	LINKEDIN_REDIRECT_URI=http://localhost:8000/api/linkedin/callback
	GEMINI_API_KEY=your_gemini_api_key
	SECRET_KEY=your_secret_key
	# Add any other required variables
	```
4. Start the FastAPI server:
	```sh
	uvicorn main:app --reload
	```


### 2. Frontend Setup

1. Navigate to the frontend folder:
	```sh
	cd frontend
	```
2. Install Node.js dependencies:
	```sh
	npm install
	```
3. Create a `.env` file in the `frontend/` directory. You can copy from `.env.example` if available:
	```sh
	cp .env.example .env
	# or create manually if not present
	```
	Add the following variable (example):
	```env
	NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
	# Add any other required variables
	```
4. Start the development server:
	```sh
	npm run dev
	```

## Usage

- Access the frontend at `http://localhost:3000`
- Log in with LinkedIn, generate posts, schedule them, and view analytics

## Notes

- Do not commit `.env` or `node_modules` folders.
- Ensure MongoDB is running and accessible by the backend.
- For deployment, configure environment variables and use production build commands.

---

For more details, see the `backend/README.md` and `frontend/README.md` if present.
