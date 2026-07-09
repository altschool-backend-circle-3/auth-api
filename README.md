# Auth API — AltSchool Backend Engineering Circle

📄 **[Read the full Project Scope Document first →](./auth-api-project-scope.md)**

Start there before touching any code — it covers MVP features, API contract, token strategy, data model, folder structure, and git workflow. This README covers setup and running the project locally; the scope doc covers what we're building and why.

**Other project docs:**

- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) — git workflow, branching, commit conventions, and how to submit a PR
- 🗂️ [PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md) — what every folder and file does, and how a request flows through the app
- ✅ [TODO.md](./TODO.md) — full task breakdown from setup to launch

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
- Access to the project's MongoDB Atlas organization (ask the circle lead for an invite)
- Your own MongoDB Atlas project and cluster (see [Database Setup](#database-setup) below)

### Installation

```bash
git clone https://github.com/altschool-backend-circle-3/auth-api.git
cd auth-api
npm install
```

### Database Setup

Each contributor runs their **own isolated MongoDB Atlas project and cluster** for this MVP, rather than sharing one database. This keeps test data (signups, deletions, edits) fully separate between contributors while everyone works against the same codebase.

1. Accept the invite to the project's Atlas organization
2. Inside the org, create your own Atlas **Project** (e.g., `yourname-dev-env`)
3. Inside that project, create your own free-tier (M0) **Cluster**
4. Create a **Database User** for yourself (username + password — separate from your Atlas login)
5. Under Network Access, allow access from anywhere (`0.0.0.0/0`) — acceptable for this learning project, not something to carry over to production use
6. Copy your personal connection string for the next step

### Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Required variables:

```
MONGO_URI=your_own_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

`MONGO_URI` should be your own personal connection string from the Database Setup step above — not shared with other contributors. Never commit your actual `.env` file — it's gitignored by default.

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

Full workflow details — branching strategy, commit conventions, PR process, and database setup — are documented in [CONTRIBUTING.md](./CONTRIBUTING.md). Quick summary:

- `main` is stable and never touched directly; `dev` is the active working branch
- Branch off `dev` (`feature/signup`, `feature/login`, etc.), open PRs into `dev`, not `main`
- At least one review approval required before merge
- `dev` is promoted to `main` once features are tested against the Definition of Done, handled by the circle lead

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the complete step-by-step.

## Known Limitations (by design, for MVP)

- No forgot-password/email-reset flow yet
- No refresh tokens — JWT is short-lived, re-login required on expiry
- Token stored in `localStorage` on the frontend — a deliberate tradeoff for simplicity while the team is learning, documented in the scope doc

---

_A project by learners, for learning — questions and honest code review welcome._
