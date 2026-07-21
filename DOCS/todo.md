# TODO — Auth API Project

Granular task breakdown from project kickoff to MVP completion. Check items off as they're done. Tasks are grouped in phases — later phases assume earlier ones are complete, but tasks _within_ a phase can often be split across contributors and worked on in parallel.

---

## Phase 0: Infrastructure Setup

_(Mostly done already — kept here for completeness and future reference)_

- [x] Create GitHub organization
- [x] Create `auth-api` repository under the org
- [x] Add `.gitignore` (Node template)
- [x] Create `dev` branch from `main`
- [x] Set `dev` as default branch
- [x] Enable branch protection on `main` (require PR + approval)
- [x] Enable branch protection on `dev` (require PR + approval)
- [x] Add team/contributors with Write access
- [x] Confirm all circle members have accepted their GitHub invite
- [x] Add project scope document to repo
- [x] Add README with scope doc link at top
- [x] Create initial folder structure (`config`, `models`, `controllers`, `routes`, `middleware`, `utils`, `public`)

---

## Phase 1: Local Environment & Dependencies

- [x] Every contributor clones the repo locally
- [x] Every contributor signs up for MongoDB Atlas (free tier)
- [x] Every contributor creates their own Atlas cluster
- [x] Every contributor grabs their own connection string
- [x] Create `.env.example` in repo (committed) listing required variable names only
- [x] Every contributor creates their own local `.env` (never committed) using `.env.example` as a guide
- [x] Run `npm init -y` to generate initial `package.json` (if not already done)
- [x] Install core dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- [x] Install dev dependency: `nodemon`
- [x] Add `"dev": "nodemon server.js"` script to `package.json`
- [x] Commit `package.json` and `package-lock.json`
- [x] Confirm `node_modules/` and `.env` are both in `.gitignore`
- [x] Every contributor runs `npm install` after pulling, confirms app boots locally

---

## Phase 2: Backend Foundation

- [x] `config/db.js` — write MongoDB connection function using `mongoose.connect()`
- [x] `server.js` — set up basic Express app (import express, create app instance)
- [x] `server.js` — connect to DB on startup (import and call `config/db.js`)
- [x] `server.js` — add `express.json()` middleware so the app can parse JSON request bodies
- [x] `server.js` — add `cors` middleware
- [x] `server.js` — set app to listen on `process.env.PORT`
- [x] Confirm server boots with `npm run dev` and logs "MongoDB connected" + "Server running on port X"

---

## Phase 3: Data Model

- [x] `models/User.js` — define Mongoose schema: `email`, `password`, `isAdmin`, `createdAt`
- [x] Set `email` as `required`, `unique`, `lowercase`, `trim`
- [x] Set `password` as `required`, `select: false`
- [x] Set `isAdmin` default to `false`
- [x] Export the model (`mongoose.model('User', userSchema)`)
- [x] Manually test: confirm duplicate email insert throws a MongoDB error (code `11000`)

---

## Phase 4: Utilities & Middleware

- [x] `utils/generateToken.js` — function that signs a JWT given a user ID, using `JWT_SECRET`
- [x] `middleware/authMiddleware.js` — extract token from `Authorization: Bearer` header
- [x] `middleware/authMiddleware.js` — verify token, attach decoded user info to `req.user`
- [x] `middleware/authMiddleware.js` — return `401` if token missing or invalid
- [x] `middleware/adminMiddleware.js` — check `req.user.isAdmin === true`
- [x] `middleware/adminMiddleware.js` — return `403` if not an admin
- [ ] Manually test both middleware functions with valid/invalid/missing tokens using Postman

---

## Phase 5: Auth Endpoints (Controllers + Routes)

### Sign Up

- [ ] `controllers/authController.js` — write `signup` function
- [ ] Hash password with `bcryptjs` before saving
- [ ] Handle duplicate email error gracefully (return a clean `400`, not a raw MongoDB error)
- [ ] Return consistent success response shape (per scope doc)
- [ ] Wire up `POST /api/auth/signup` in `routes/authRoutes.js`
- [ ] Test via Postman: valid signup, duplicate email, missing fields

### Login

- [x] `controllers/authController.js` — write `login` function
- [x] Look up user by email, explicitly select password field (`.select('+password')`)
- [x] Compare submitted password against hash with `bcrypt.compare()`
- [x] Generate JWT on success using `utils/generateToken.js`
- [x] Return consistent response shape with token + user info (no password)
- [x] Wire up `POST /api/auth/login` in `routes/authRoutes.js`
- [ ] Test via Postman: correct credentials, wrong password, non-existent email

### Change Password

- [ ] `controllers/authController.js` — write `changePassword` function
- [ ] Require current password, verify it matches before allowing change
- [ ] Hash new password before saving
- [ ] Wire up `PATCH /api/auth/change-password` in `routes/authRoutes.js`, protected by `authMiddleware`
- [ ] Test via Postman: correct current password, wrong current password, no token

### Get All Users

- [ ] `controllers/authController.js` — write `getAllUsers` function
- [ ] Exclude password field from returned data
- [ ] Wire up `GET /api/users` in `routes/authRoutes.js`, protected by `authMiddleware` + `adminMiddleware`
- [ ] Test via Postman: as admin, as non-admin, with no token

---

## Phase 6: Backend Integration Pass

- [ ] Full manual test pass of all 4 endpoints in one sitting, using Postman/Thunder Client
- [ ] Confirm error responses are consistent in shape across all endpoints
- [ ] Confirm no endpoint ever returns a password field, hashed or not
- [ ] Confirm `401` vs `403` are used correctly and consistently
- [ ] Code walkthrough session with the circle before moving to frontend

---

## Phase 7: Frontend Foundation

- [ ] `public/index.html` — basic landing page with links to signup/login
- [ ] `public/signup.html` — signup form (email, password fields)
- [ ] `public/login.html` — login form (email, password fields)
- [ ] `public/dashboard.html` (or similar) — simple authenticated view showing logged-in user info + change password form
- [ ] Basic shared CSS file for all pages (`public/css/style.css`) — function over polish for MVP
- [ ] `server.js` — serve `public/` as static files (`express.static()`)

---

## Phase 8: Frontend Logic (JS)

### Signup Page

- [ ] `public/js/signup.js` — capture form submit, prevent default page reload
- [ ] Send `POST` request to `/api/auth/signup` with fetch
- [ ] Handle success (redirect to login) and error (display message) states

### Login Page

- [ ] `public/js/login.js` — capture form submit
- [ ] Send `POST` request to `/api/auth/login`
- [ ] On success, store JWT in `localStorage`
- [ ] Redirect to dashboard on success, show error message on failure

### Dashboard / Change Password

- [ ] `public/js/dashboard.js` — on page load, check `localStorage` for token; redirect to login if missing
- [ ] Fetch and display logged-in user's basic info (optional: a "who am I" call, or just show what's in the JWT)
- [ ] Change password form — send `PATCH` request with `Authorization: Bearer <token>` header
- [ ] Handle success/error states for password change
- [ ] Add a logout button — clears token from `localStorage`, redirects to login

### Admin View (Get All Users)

- [ ] Add a simple admin-only page or section that calls `GET /api/users`
- [ ] Handle `403` gracefully for non-admin users (hide the link/section, or show a clear message)
- [ ] Render returned user list in a simple table or list

---

## Phase 9: Full End-to-End Testing

- [ ] Manual full user journey test: signup → login → change password → logout → login again with new password
- [ ] Manual admin journey test: login as admin → view all users
- [ ] Manual negative test: try accessing dashboard/admin page without logging in
- [ ] Manual negative test: try accessing admin view as a non-admin user
- [ ] Cross-check every item in the scope doc's Definition of Done (Section 9)

---

## Phase 10: Documentation Pass

- [ ] Update README if any setup steps changed during build
- [ ] Confirm `.env.example` matches every env variable actually used in the code
- [ ] Add brief comments to trickier parts of the code (JWT verification, password hashing) for future learners
- [ ] Confirm scope doc and README stay consistent with final implementation

---

## Phase 11: Promotion to `main`

- [ ] Confirm all Phase 9 tests pass
- [ ] Circle lead reviews `dev` in full
- [ ] Merge `dev` → `main`
- [ ] Tag the release (e.g. `v1.0-mvp`) for a clear reference point
- [ ] Announce MVP completion to the circle

---

## Stretch Goals (Post-MVP, Not Required)

- [ ] Forgot password / email reset flow (nodemailer + reset tokens)
- [ ] Email verification on signup
- [ ] Refresh tokens
- [ ] Rate limiting on login attempts
- [ ] Migrate token storage from `localStorage` to httpOnly cookies, compare tradeoffs
- [ ] Basic CI (run tests automatically on PR)
- [ ] Deploy live (e.g. Render/Railway for backend, Atlas already handles DB)

---

_Update this file as tasks are completed or re-scoped — it should always reflect where the project actually stands, not where it stood at kickoff._
