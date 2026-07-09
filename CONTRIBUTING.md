# Contributing to Auth API

Thanks for contributing to this project. This document covers everything you need to know about how we work together — branching, commits, pull requests, and local setup — so contributions stay consistent no matter who's picking up a task.

If you haven't already, read the [Project Scope Document](./auth-api-project-scope.md) first. It covers what we're building and why; this document covers how we work.

---

## Before You Start

Make sure you have:
- Node.js (v18+) installed
- A GitHub account, added to the org and this repo
- Your own MongoDB Atlas project and cluster set up (see [Database Setup](#database-setup) below — each contributor runs their own isolated cluster for this MVP)

### Local Setup

```bash
git clone https://github.com/altschool-backend-circle-3/auth-api.git
cd auth-api
npm install
cp .env.example .env
```

Fill in your own `.env` values (your personal MongoDB connection string, a JWT secret, and a port). Never commit this file.

Run the app locally:
```bash
npm run dev
```

---

## Branch Structure

This project uses a two-branch strategy, plus short-lived feature branches:

| Branch | Purpose |
|--------|---------|
| `main` | Stable, always-working. **Never touched directly.** Only updated by promoting a tested `dev`. |
| `dev` | The active working branch. All feature branches are cut from here, and all PRs merge back into here. |
| `feature/*` | Short-lived branches for individual features or fixes. Branched from `dev`, merged back into `dev`, then deleted. |

**Both `main` and `dev` are protected** — direct pushes to either are blocked. Every change goes through a pull request, no exceptions, including for the circle lead.

---

## Git Workflow — Step by Step

**1. Start from an up-to-date `dev`:**
```bash
git checkout dev
git pull origin dev
```

**2. Create a feature branch:**
```bash
git checkout -b feature/short-description
```
Naming convention: `feature/signup`, `feature/login`, `feature/change-password`, `feature/get-users`, `feature/auth-middleware`, `feature/frontend-login-page`, etc. Use `fix/` instead of `feature/` for bug fixes (e.g. `fix/token-expiry-check`).

**3. Make your changes, commit as you go:**
```bash
git add .
git commit -m "feat: add password hashing to signup controller"
```

**4. Push your branch:**
```bash
git push -u origin feature/short-description
```

**5. Open a Pull Request — into `dev`, not `main`.**
GitHub will prompt you to open a PR after pushing. Double-check the base branch is set to `dev` before submitting — it sometimes defaults to `main`.

**6. Get at least one review approval before merging.** Address any feedback with new commits on the same branch — no need to open a new PR.

**7. Once merged, delete the feature branch** (GitHub offers a button for this right after merge) to keep the branch list clean.

---

## Commit Message Convention

Prefix commits to make history scannable:

| Prefix | Use for |
|--------|---------|
| `feat:` | New functionality |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes only |
| `chore:` | Dependency updates, config, non-functional changes |
| `refactor:` | Code restructuring with no behavior change |
| `test:` | Adding or updating tests |

Example: `feat: add JWT verification middleware`

---

## Promoting `dev` to `main`

Once all planned features for a milestone are merged into `dev` and manually tested against the [Definition of Done](./auth-api-project-scope.md#9-definition-of-done-mvp), `dev` is promoted to `main`. This merge is handled by the circle lead (or designated co-lead) — not something any contributor triggers independently. This keeps `main`'s history clean and gives the team one clear, stable reference point at a time.

---

## Database Setup

Each contributor runs their **own isolated MongoDB Atlas project and cluster** for this MVP — not a shared database. This avoids test data colliding between contributors (e.g., one person's test signups or a deletion during debugging affecting someone else's work).

To set this up:
1. Accept the invite to the Atlas organization
2. Create your own Atlas **Project** (e.g., `yourname-dev-env`)
3. Inside that project, create your own free-tier (M0) **Cluster**
4. Create a **Database User** (username + password — separate from your Atlas login)
5. Copy your connection string and paste it into your own local `.env` as `MONGO_URI`

Your cluster and data stay private to you — other contributors run the same setup independently, with their own isolated projects.

---

## Dependencies

If your work requires a new package:

```bash
npm install <package-name>
```

This updates `package.json` and `package-lock.json` automatically — commit both files as part of your PR. After pulling any branch with dependency changes, run `npm install` again locally to sync your own `node_modules/`.

Never commit `node_modules/` — it's already excluded via `.gitignore` and gets fully reconstructed by `npm install`.

---

## Pull Request Checklist

Before requesting review, confirm:
- [ ] Branch was cut from an up-to-date `dev`
- [ ] PR targets `dev`, not `main`
- [ ] Code has been manually tested locally (via Postman/browser, as relevant)
- [ ] No secrets, tokens, or `.env` values are included in the diff
- [ ] Commit messages follow the prefix convention
- [ ] Relevant docs (README, scope doc) updated if behavior or setup changed

---

## Questions?

If something about scope, architecture, or a design decision is unclear, check the [Project Scope Document](./auth-api-project-scope.md) and [PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md) first. If it's still unclear, ask in the group rather than guessing — this is a learning project, and clarifying questions are expected, not a sign of falling behind.

---

*This is a living document — if our workflow changes as the project grows, update this file so it reflects how we actually work, not how we worked at kickoff.*
