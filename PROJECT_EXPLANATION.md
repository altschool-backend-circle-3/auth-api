# Project Explanation — Auth API

This document explains what every folder and file in this project does, and how they work together. It's written for anyone new to the project — a contributor, a reviewer, or anyone trying to understand the architecture without reading through every line of code first.

---

## The Big Picture

This project follows a **layered architecture** — a common pattern in Express/Node backends where each folder has one specific job, and no folder does another folder's job. The benefit: you can change how passwords are hashed without touching routing code, or add a new endpoint without touching the database schema. Each piece stays independent and easy to reason about on its own.

Here's the mental model: a request comes in from a browser, passes through several layers in order, and a response goes back out. Each folder below represents one of those layers.

```
Browser (public/)
   ↓
server.js  (entry point — wires everything together)
   ↓
routes/    (which URL triggers which function?)
   ↓
middleware/ (should this request even be allowed through?)
   ↓
controllers/ (the actual logic — what should happen?)
   ↓
models/    (talk to the database)
   ↓
MongoDB (Atlas)
```

---

## `server.js` — The Entry Point

This is the file that actually starts the application. When you run `npm run dev`, this is the file being executed. Its responsibilities:

- Creates the Express application instance
- Connects to MongoDB (by calling the function in `config/db.js`)
- Registers middleware that should run on *every* request (like `express.json()` to parse incoming JSON, and `cors` to allow the frontend to call the API)
- Tells Express to serve the `public/` folder as static files (so the browser can load the HTML/CSS/JS)
- Wires in the routes (from `routes/`)
- Starts the server listening on a port

Think of `server.js` as the conductor — it doesn't play any instrument itself, it just makes sure everyone else knows when to come in.

---

## `config/` — External Service Connections

**`config/db.js`**

This file's only job is establishing the connection to MongoDB using Mongoose, based on the `MONGO_URI` stored in `.env`. It doesn't know anything about users, passwords, or routes — just "how do we connect to the database."

Keeping this separate matters because if the database connection logic ever needs to change (e.g., adding retry logic, or switching to a different MongoDB setup), it's isolated to one file, rather than scattered wherever `mongoose.connect()` happens to be called.

---

## `models/` — The Shape of Our Data

**`models/User.js`**

This defines the **Mongoose schema** — a blueprint describing exactly what a "User" document looks like in MongoDB. Fields:

- `email` — required, unique (MongoDB will reject duplicate signups at the database level), stored in lowercase and trimmed of whitespace
- `password` — required, but marked `select: false` so it's never returned by default in any query — you have to explicitly ask for it, which happens only during login
- `isAdmin` — a boolean flag, defaults to `false`, used to gate the "get all users" endpoint
- `createdAt` — a timestamp, defaults to the current time on creation

This file doesn't handle HTTP requests, doesn't know about JWTs, and doesn't know what a controller is. Its only responsibility is: define what a User record looks like, and provide the interface (via Mongoose) for creating, finding, and updating those records.

---

## `controllers/` — The Actual Logic

**`controllers/authController.js`**

This is where the real decision-making happens for each feature. Each function here corresponds to one piece of functionality:

- **`signup`** — takes the incoming email/password, hashes the password with bcrypt, creates a new User document, handles the case where the email already exists, and sends back a response
- **`login`** — finds the user by email, compares the submitted password against the stored hash, and if it matches, generates a JWT and sends it back
- **`changePassword`** — verifies the user's current password before allowing them to set a new one (requires the user to already be authenticated — see `middleware/`)
- **`getAllUsers`** — fetches every user from the database, deliberately excluding the password field, and returns the list (requires the requester to be an authenticated admin)

Controllers are the layer that *uses* the model (to read/write data) and shapes what gets sent back in the response. They don't know or care which URL triggered them — that's the routes' job.

---

## `routes/` — The Map From URLs to Logic

**`routes/authRoutes.js`**

This file is deliberately thin. Its only job is mapping an HTTP method + URL path to the correct controller function, and attaching any middleware that should run first. For example:

```js
router.post('/signup', signup);
router.post('/login', login);
router.patch('/change-password', authMiddleware, changePassword);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
```

Notice how `change-password` and `users` have middleware listed *before* the controller function — that's what enforces "you must be logged in" (and for `users`, "you must be an admin") before the controller logic ever runs.

---

## `middleware/` — The Gatekeepers

Middleware functions run **between** the incoming request and the controller. They can either let the request continue, or stop it early and send back an error response.

**`middleware/authMiddleware.js`**
- Looks for a JWT in the request's `Authorization: Bearer <token>` header
- Verifies the token is valid and not expired
- If valid, attaches the decoded user info to `req.user` so later code (controllers) can access it
- If missing or invalid, immediately responds with `401 Unauthorized` — the request never reaches the controller

**`middleware/adminMiddleware.js`**
- Runs *after* `authMiddleware` (so `req.user` is already available)
- Checks whether `req.user.isAdmin` is `true`
- If not, responds with `403 Forbidden`
- If yes, lets the request continue to the controller

This is what gives us the meaningful distinction between "you're not logged in at all" (401) and "you're logged in, but you're not allowed to do this" (403).

---

## `utils/` — Small Reusable Helpers

**`utils/generateToken.js`**

A small function that signs a JWT given a user's ID, using the `JWT_SECRET` from `.env`. It exists as a separate file because both `signup` and `login` need to generate a token — rather than repeating the same JWT-signing code in two places, both controllers call this one shared function.

This is a common pattern: anything used in more than one place gets pulled out into `utils/` so there's a single source of truth for that logic.

---

## `public/` — The Frontend

This is the only folder that isn't part of the backend logic — it's what the browser actually loads and runs.

- **`index.html`** — landing page, links to signup/login
- **`signup.html`** / **`login.html`** — forms for account creation and authentication
- **`dashboard.html`** (or similar) — an authenticated view showing the logged-in user's info and the change-password form
- **`js/`** — the JavaScript files that make these pages interactive: capturing form submissions, calling the API with `fetch()`, storing the JWT in `localStorage` after login, and redirecting based on success/failure
- **`css/`** — shared styling across pages

`server.js` serves this folder directly using Express's static file serving — so when a browser requests `/login.html`, Express just hands over the file from `public/` rather than routing it through the API logic at all.

---

## `.env` and `.env.example` — Configuration & Secrets

- **`.env`** (never committed) — holds the real values: your actual MongoDB connection string, JWT secret, and port number. Every contributor has their own local copy with their own values.
- **`.env.example`** (committed) — lists only the *names* of the required variables, with no real values, so anyone cloning the repo knows exactly what they need to create in their own `.env`.

```
MONGO_URI=
JWT_SECRET=
PORT=
```

---

## `package.json` and `package-lock.json` — Dependency Manifest

- **`package.json`** — the human-readable list of every package the project depends on (Express, Mongoose, bcryptjs, etc.), plus scripts like `npm run dev`
- **`package-lock.json`** — the exact resolved versions of every package and sub-dependency, auto-generated, ensuring everyone who runs `npm install` gets identical package versions

`node_modules/` (where the actual installed code lives) is never committed — it's fully reconstructed from these two files whenever someone runs `npm install`.

---

## `auth-api-project-scope.md` — The Scope Document

Not code, but part of the project's foundation. Documents the MVP feature list, API contract (endpoints, request/response shapes), token strategy decision, data model, folder structure, and git workflow — agreed on *before* any code was written. Any contributor unsure of a design decision should check here before guessing or asking.

---

## Putting It All Together: One Request, Start to Finish

To make all of this concrete, here's exactly what happens when someone logs in:

1. Browser loads `public/login.html`, user fills in email/password, submits the form
2. `public/js/login.js` intercepts the submit, sends a `POST` request to `/api/auth/login`
3. `server.js` receives the request, hands it to Express's routing
4. `routes/authRoutes.js` matches `POST /login` to the `login` function — no middleware needed here, since you're not authenticated yet
5. `controllers/authController.js`'s `login` function runs:
   - Uses `models/User.js` to find the user by email, explicitly selecting the password field
   - Compares the submitted password against the stored hash
   - On success, calls `utils/generateToken.js` to create a JWT
   - Sends back `{ success: true, data: { token, user } }`
6. `public/js/login.js` receives this response, stores the token in `localStorage`, and redirects to the dashboard

Every folder in this project exists because it plays one specific, isolated role in that flow — and that's the reasoning to hold onto whenever you're deciding where a new piece of code belongs.

---

*If a new file or folder gets added as the project grows, update this document so it stays an accurate map of the project — not just a snapshot of how things looked at kickoff.*
