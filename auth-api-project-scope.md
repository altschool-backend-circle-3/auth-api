# Authentication API — Project Scope Document

**Project:** Collaborative Authentication API
**Team:** AltSchool Backend Engineering Circle
**Stack:** HTML, CSS, JavaScript (frontend) · Express.js (backend) · MongoDB (database)
**Methodology:** Document Driven Development — this doc is written and agreed on _before_ anyone opens a code editor.

---

## 1. Problem & Purpose

Every backend system that has users needs to answer three questions:

1. Who are you? (**Authentication**)
2. What are you allowed to do? (**Authorization**)
3. How do we keep your credentials safe while doing both? (**Security**)

This project exists to give the circle hands-on practice answering those three questions correctly, using patterns that transfer directly to real jobs — the same session/token logic shows up whether you're writing Express, NestJS, Django, or FastAPI later.

**Why this is a good first group project:** it's small enough to ship in a few weeks, but it forces every contributor to touch the full request lifecycle — routing, middleware, validation, hashing, database schema, and error handling — instead of just CRUD on a throwaway resource.

---

## 2. MVP Scope — What We're Building

The MVP is deliberately narrow. Anything not listed here is a stretch goal, not a requirement.

### In-scope features

| #   | Feature             | What it does                                                                                                           |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **Sign Up**         | Create a new user account with email + password. Password is hashed before storage.                                    |
| 2   | **Login**           | Verify credentials, issue an auth token (JWT) on success.                                                              |
| 3   | **Change Password** | Authenticated user submits current password + new password; current password is verified before the change is allowed. |
| 4   | **Get All Users**   | Returns a list of registered users — **admin-only**, and never includes password hashes.                               |
| 5   | **Auth Middleware** | Protects routes 3 and 4 — requests without a valid token are rejected before reaching the route handler.               |
| 6   | **Basic Frontend**  | Static HTML/CSS/JS pages for signup, login, and a simple dashboard that calls the API.                                 |

### Explicitly out of scope (for now)

- Forgot password / email reset flow (needs nodemailer, reset tokens, expiry — real feature, but a v2 stretch goal)
- Email verification on signup
- Refresh tokens / token rotation
- Rate limiting / brute-force protection (worth noting as a "in production you'd add this" comment, not building it)
- Social login (Google/GitHub OAuth)
- Frontend styling polish — function over form for MVP

Keeping this list visible matters as much as the feature list. It stops scope creep mid-sprint when someone gets excited and starts building "forgot password" on their own branch.

---

## 3. Why "Get All Users" Needs Rules, Not Just a Route

As originally phrased, this endpoint is a data leak: anyone who hits it gets every user's data. For the MVP, lock in these decisions:

- **Authorization required:** only users with an `isAdmin: true` flag can call this endpoint. This is your team's first taste of _authorization_ (what you can do) as distinct from _authentication_ (who you are).
- **Field exclusion:** the response must never include the `password` field, even hashed. Use Mongoose's `.select('-password')` or exclude it at the schema level with `select: false`.
- **Status codes to practice here:** `401 Unauthorized` (no token / invalid token) vs `403 Forbidden` (valid token, but not an admin) — these get confused constantly, and this endpoint is the perfect place to nail the difference.

---

## 4. Token Strategy — Decide Once, as a Team

Pick **one** approach and write it down so nobody improvises their own version in their branch.

**Recommended for this project: JWT sent in the response body, stored in `localStorage` on the frontend, sent back via `Authorization: Bearer <token>` header.**

Why this over httpOnly cookies for the MVP:

- Simpler to implement and debug when the team is still learning — you can literally see the token in devtools and Postman
- No CORS/cookie-config headaches to fight while everyone's also learning Express for the first time
- The tradeoff (XSS vulnerability, since JS can read localStorage) is worth knowing about and stating explicitly as a limitation in your README — that's a legitimate engineering decision, not an oversight, as long as it's documented

Stretch goal for later: migrate to httpOnly cookies and compare the two approaches directly. That comparison is genuinely valuable interview material.

---

## 5. Data Model

**User Schema (Mongoose)**

```js
{
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, select: false }, // never returned by default
  isAdmin:    { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now }
}
```

Notes:

- `unique: true` on email creates a MongoDB index and will throw a duplicate-key error (code `11000`) on repeat signups. Handle that error explicitly rather than letting it crash the server.
- `select: false` on password excludes it from query results by default — you have to explicitly ask for it (`.select('+password')`) during login, which is a nice forcing function against accidentally leaking it.

---

## 6. API Endpoints

| Method | Route                       | Auth required?   | Description                                                 |
| ------ | --------------------------- | ---------------- | ----------------------------------------------------------- |
| POST   | `/api/auth/signup`          | No               | Create new user. Body: `{ email, password }`                |
| POST   | `/api/auth/login`           | No               | Verify credentials, return JWT. Body: `{ email, password }` |
| PATCH  | `/api/auth/change-password` | Yes              | Body: `{ currentPassword, newPassword }`                    |
| GET    | `/api/users`                | Yes (admin only) | Return all users, minus passwords                           |

**Response shape convention** — agree on one consistent envelope across every endpoint, e.g.:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "...", "user": { "email": "...", "isAdmin": false } }
}
```

Consistency here matters more than the exact shape — whoever's building the frontend shouldn't have to guess whether a given endpoint returns `data.user` or just `user`.

---

## 7. Folder Structure

```
auth-api/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js             # Mongoose schema
├── controllers/
│   └── authController.js   # signup, login, changePassword, getAllUsers logic
├── routes/
│   └── authRoutes.js       # route definitions, wired to controllers
├── middleware/
│   ├── authMiddleware.js   # verifies JWT, attaches req.user
│   └── adminMiddleware.js  # checks req.user.isAdmin
├── utils/
│   └── generateToken.js    # JWT signing helper
├── public/                 # frontend: HTML/CSS/JS
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   └── js/
├── .env                     # JWT_SECRET, MONGO_URI (never committed)
├── server.js
└── package.json
```

Separating `controllers` from `routes` from the start is a small habit that pays off — it's the same separation-of-concerns instinct as a `model.py`/`main.py` split, just applied at team scale.

---

## 8. Git Workflow

**Branch strategy: `main` + `dev`**

- **`main`** — stable, always-working branch. Never touched directly by contributors. Only ever updated by promoting a tested `dev`.
- **`dev`** — the active working branch. All feature branches are cut from here, and all PRs merge back into here.
- **`feature/*`** — short-lived branches for individual features, branched from `dev`, merged back into `dev`, then deleted.

**Branch naming:** `feature/signup`, `feature/login`, `feature/change-password`, `feature/get-users`, `feature/auth-middleware`

**Rules:**

- No direct pushes to `main` **or** `dev` — every change goes through a PR, even small ones, so the whole circle gets practice reviewing code
- PRs into `dev` require at least one approval before merge
- Branch protection is enabled on both `main` and `dev`

**Promoting `dev` → `main`:**

- Done in batches, not continuously — ideally once all MVP features are merged into `dev` and verified against the Definition of Done (Section 9)
- This merge is handled by the circle lead (or a designated co-lead) — not something any contributor triggers independently
- Before promoting, manually verify each endpoint (e.g. via Postman/Thunder Client) against the Definition of Done checklist

**Commit convention:** `feat:`, `fix:`, `docs:`

---

## 9. Definition of Done (MVP)

The project is complete when:

- [ ] All 4 endpoints work and are tested via Postman/Thunder Client
- [ ] Passwords are hashed (bcrypt) — never stored or returned in plaintext
- [ ] Auth middleware correctly blocks unauthenticated requests
- [ ] Admin middleware correctly blocks non-admin requests to `/api/users`
- [ ] Frontend can sign up, log in, and change password against the live API
- [ ] README documents setup steps, env variables needed, and the token-storage decision
- [ ] Circle has done at least one code walkthrough session before final merge to `main`
