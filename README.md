# Auth API — AltSchool Backend Engineering Circle

📄 **[Read the full Project Scope Document first →](./auth-api-project-scope.md)**

Start there before touching any code — it covers MVP features, API contract, token strategy, data model, folder structure, and git workflow. This README covers setup and running the project locally; the scope doc covers what we're building and why.

---

## About This Project

A collaborative Authentication API built by the AltSchool Backend Engineering Circle as a pre-semester project. It covers signup, login, password change, and an admin-gated user listing — small in scope, but touching most of the core concepts a backend engineer needs: password hashing, JWT auth, middleware, database schema design, and role-based access control.

Built by a group of learners, most transitioning into or newly picking up the JavaScript ecosystem. Code, PRs, and reviews are done in the open — expect real feedback, not rubber stamps.

## Tech Stack

- **Backend:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **Frontend:** HTML, CSS, vanilla JavaScript

## Features (MVP)

- Sign up
- Login
- Change password (authenticated)
- Get all users (admin-only, passwords excluded)

Full detail on each in the [scope document](./auth-api-project-scope.md).

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB connection string (local instance or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/your-org-name/auth-api.git
cd auth-api
npm install
```

### Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Required variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Never commit your actual `.env` file — it's gitignored by default.

### Running Locally

```bash
npm run dev
```

The API will be available at `http://localhost:5000` (or whatever port you set).

## API Endpoints

| Method | Route                       | Auth required?   | Description                                 |
| ------ | --------------------------- | ---------------- | ------------------------------------------- |
| POST   | `/api/auth/signup`          | No               | Create a new user                           |
| POST   | `/api/auth/login`           | No               | Log in, receive a JWT                       |
| PATCH  | `/api/auth/change-password` | Yes              | Change password (requires current password) |
| GET    | `/api/users`                | Yes (admin only) | List all users, passwords excluded          |

Full request/response shapes are in the [scope document](./auth-api-project-scope.md#6-api-endpoints).

## Contributing

- `main` is the stable, always-working branch — it is **not** touched directly by contributors
- `dev` is the active working branch — all feature work happens here
- Branch off `dev` using the naming convention: `feature/signup`, `feature/login`, etc.
- Open a PR **into `dev`** — direct pushes to both `main` and `dev` are disabled by branch protection
- At least one review approval is required before merge into `dev`
- Once features in `dev` are complete and tested against the Definition of Done, `dev` is promoted to `main` (this merge is handled by the circle lead)
- Keep commits scoped and messages descriptive (`feat:`, `fix:`, `docs:` prefixes welcome)

## Known Limitations (by design, for MVP)

- No forgot-password/email-reset flow yet
- No refresh tokens — JWT is short-lived, re-login required on expiry
- Token stored in `localStorage` on the frontend — a deliberate tradeoff for simplicity while the team is learning, documented in the scope doc

---

_A project by learners, for learning — questions and honest code review welcome._
