# DevJournal Project Report and Interview Brief

**Project:** DevJournal
**Category:** Full-stack developer productivity and learning platform
**Implementation status:** Functional JavaScript application with local and Render deployment support
**Repository:** `Priyan5huMudgal/DEVJOURNAL`
**Last updated:** September 2026

This report is the source of truth for understanding, presenting, and discussing DevJournal in technical interviews. It is based on the current repository implementation and distinguishes implemented behavior from proposed improvements.

## Executive Summary

DevJournal is a multi-user workspace that consolidates developer journals, learning goals, roadmaps, resources, reusable snippets, calendar activity, and productivity analytics. The application uses a React and JavaScript frontend, an Express and Node.js backend, MongoDB with Mongoose, and JWT-based authentication.

The system is hosted as a single Express application. In development, Express mounts Vite middleware; in production, it serves the compiled React application from `dist` while exposing REST endpoints under `/api`. User-owned records are protected by JWT middleware and database queries scoped by `userId`.

The current implementation is suitable for a personal productivity product and interview demonstration. The main engineering limitations are the absence of automated tests, in-memory analytics over complete user datasets, regex-based search, localStorage access-token storage, and a refresh-token flow that does not yet implement rotation.

## Current Project Status

| Area                 | Current status                                                     |
| -------------------- | ------------------------------------------------------------------ |
| Frontend             | React 19, JavaScript/JSX, Vite, Tailwind CSS, DaisyUI              |
| Backend              | Express REST API running from `server.js`                          |
| Persistence          | MongoDB Atlas through Mongoose                                     |
| Authentication       | JWT access token, HTTP-only refresh-token cookie, bcryptjs hashing |
| Deployment           | GitHub-connected Render Web Service                                |
| Local development    | `npm run dev` with Express and Vite middleware                     |
| Production execution | `npm run build` followed by `npm start`                            |
| Health verification  | `/api/health` returns database connectivity status                 |

## Recent Engineering Updates

- Migrated the application from TypeScript to JavaScript and JSX.
- Updated server-side imports for Node.js ESM compatibility.
- Added production-mode detection through `NODE_ENV` so the server serves `dist` in production and Vite middleware in development.
- Added Render hostname support and production deployment documentation.
- Corrected the DaisyUI stylesheet import order so Vite/PostCSS can process the CSS consistently.
- Disabled the optional Vite HMR websocket in middleware mode to avoid recurring local port conflicts when duplicate terminal sessions are opened.
- Verified local MongoDB connectivity, the production build, the development server, and the `/api/health` endpoint.

The HMR change affects the development experience only: browser refresh is used instead of Vite hot module replacement. It does not change the production bundle or API behavior.

## 1. Project Summary

**DevJournal** is a full-stack developer productivity and learning management platform. It gives a developer one workspace for:

- Daily engineering journals
- Daily, weekly, and monthly goals
- Structured learning roadmaps
- Saved learning resources and bookmarks
- Reusable code snippets
- Calendar views for journals and goal deadlines
- A dashboard with productivity analytics

A concise interview introduction:

> DevJournal is a multi-user MERN-style productivity platform that I built with React and JavaScript on the frontend, Express and Node.js on the backend, and MongoDB with Mongoose for persistence. The application uses JWT authentication, protected REST APIs, user-scoped CRUD operations, and a dashboard that derives streak, goal, roadmap, mood, weekly activity, and resource-category metrics from the user's data.

Avoid claiming that it uses a separate frontend and backend deployment unless you can demonstrate that in your deployed environment. In this repository, one Express application serves the API and the React/Vite application.

## 2. Verified Technology Stack

### Frontend

- React 19
- JavaScript and JSX
- Vite
- Tailwind CSS 4 and DaisyUI
- Axios for HTTP requests
- Recharts for dashboard charts
- Motion for UI animation
- Lucide React for icons
- React Markdown for journal rendering

### Backend

- Node.js
- Express 4
- JavaScript
- Mongoose 9
- MongoDB / MongoDB Atlas
- JWT access and refresh tokens
- bcryptjs for password hashing
- Helmet for security headers
- CORS and cookie-parser
- Express JSON and URL-encoded body parsers

### Build and deployment

- Development command: `npm run dev`, which starts `server.js` with Node.js
- Production build: Vite builds the frontend and esbuild bundles `server.js` into `dist/server.cjs`
- Production command: `npm start`
- The server uses Vite middleware in development and serves `dist` statically in production
- The README states that the application is deployed on Render and uses GitHub-based deployment; describe this as the deployment setup, not as an implementation detail visible in the source tree

## 3. High-Level Architecture

```text
Browser
  |
  | React UI, AuthContext, Axios
  | Authorization: Bearer <access token>
  v
Express application (server.js)
  |
  +-- Security and parsing middleware
  |     Helmet, CORS, JSON parser, URL parser, cookies
  |
  +-- API availability guard
  |
  +-- /api/auth       -> auth routes -> auth controller
  +-- /api/journal    -> journal routes -> journal controller
  +-- /api/goals      -> goal routes -> goal controller
  +-- /api/roadmaps   -> roadmap routes -> roadmap controller
  +-- /api/resources  -> resource routes -> resource controller
  +-- /api/snippets   -> snippet routes -> snippet controller
  +-- /api/analytics  -> analytics route -> analytics controller
  +-- /api/health
  |
  v
Mongoose models
  |
  v
MongoDB
```

The backend follows a simple modular MVC-like structure:

- **Routes** define HTTP methods, paths, and middleware.
- **Middleware** authenticates requests and attaches the decoded user identity.
- **Controllers** validate inputs, apply business rules, query MongoDB, and format responses.
- **Models** define Mongoose schemas and persistence rules.
- There is no separate service or repository layer in the current implementation.

## 4. Request Lifecycle

For a protected request such as `GET /api/journal`:

1. React calls a method such as `journalService.getEntries()`.
2. The Axios request interceptor reads `accessToken` from `localStorage`.
3. Axios adds `Authorization: Bearer <token>`.
4. Express receives the request through the `/api` availability guard.
5. The journal router runs `protect` before its route handlers.
6. `protect` verifies the JWT and attaches `{ id, email }` to `req.user`.
7. The controller builds a MongoDB query containing `userId: req.user.id`.
8. Mongoose executes the query against MongoDB.
9. The controller returns a consistent response such as `{ success: true, data: ... }`.
10. The React component updates local state and re-renders the view.

The important authorization principle is that ownership is enforced in the database query, not only in the frontend. For example, update and delete operations use patterns like `findOne({ _id: id, userId })` and `findOneAndDelete({ _id: id, userId })`.

## 5. Authentication Flow

### Registration

1. The user submits name, email, and password.
2. The frontend validates required fields, email shape, and minimum password length.
3. `POST /api/auth/register` validates again on the server.
4. The server normalizes the email using lowercase and trim.
5. bcrypt generates a salt and hashes the password with cost factor 10.
6. The server creates a `User` document.
7. It signs a one-day access token and a seven-day refresh token.
8. The refresh token is stored on the user document and sent in an HTTP-only cookie.
9. The access token is returned in the JSON response.
10. The client stores the access token in `localStorage` and stores the user in React context.

### Login

1. The server finds the user by normalized email.
2. It compares the supplied password with `passwordHash` using bcrypt.
3. It signs new access and refresh tokens.
4. It replaces the stored refresh token and sets the HTTP-only cookie.
5. The client stores the access token and enters the workspace.

### Protected request

The `protect` middleware:

- Requires an `Authorization` header beginning with `Bearer `.
- Verifies the access token using `JWT_SECRET`.
- Attaches the decoded user id and email to the request.
- Returns HTTP 401 for a missing, malformed, expired, or invalid token.

### Logout

The logout controller clears the stored refresh token and clears the cookie. The frontend also removes the access token and resets the local theme.

### Honest security discussion

The implementation has useful security controls, but be precise about limitations:

- Passwords are hashed with bcrypt; plaintext passwords are not intended to be stored.
- JWT access tokens are sent in the Authorization header.
- Refresh tokens are marked HTTP-only and use `sameSite: strict`; `secure` is enabled in production.
- Helmet is installed and enabled.
- The README mentions express-rate-limit, but the current `server.js` does not mount a rate limiter. Do not claim active rate limiting unless it is added or verified in the deployed version.
- The fallback JWT secrets in source are development fallbacks. Production must provide strong `JWT_SECRET` and `JWT_REFRESH_SECRET` environment variables.
- The current client stores the access token in `localStorage`, which is convenient but has XSS exposure. A stronger production design would use short-lived access tokens in memory and rotate refresh tokens in HTTP-only cookies.
- The current logout flow does not implement a dedicated refresh-token endpoint or token rotation endpoint.

## 6. Database Design

MongoDB is used because the data is document-oriented, user-owned, and includes nested arrays such as journal code snippets and roadmap topics. Mongoose provides schemas, type-oriented models, validation, timestamps, and MongoDB access.

### User collection

```text
User
- _id: ObjectId
- name: string
- username: optional unique sparse string
- email: required unique normalized string
- passwordHash: optional string
- legacy password/fullName/profileImage fields
- avatar: string
- bio: string
- preferences:
    - theme: string
    - notifications: boolean
- refreshToken: optional string
- createdAt: Date
```

### Journal collection

```text
Journal
- _id: ObjectId
- userId: ObjectId -> User
- title: required string
- content: required string
- mood: string, default focused
- date: required Date
- tags: string[]
- images: string[]
- codeSnippets: [{ language, code, title? }]
- createdAt, updatedAt
```

### Goal collection

```text
Goal
- _id: ObjectId
- userId: ObjectId -> User
- title: required string
- description: string
- type: daily | weekly | monthly
- priority: low | medium | high
- deadline: optional Date
- status: todo | in-progress | completed
- progress: number from 0 to 100
- createdAt, updatedAt
```

Goal business rules include:

- A new goal defaults to a deadline seven days in the future if none is supplied.
- Progress 100 implies `completed`.
- Updating progress maps 0 to `todo`, values between 0 and 100 to `in-progress`, and 100 to `completed`.
- Updating status to `completed` sets progress to 100; updating to `todo` sets progress to 0.

### Roadmap collection

```text
Roadmap
- _id: ObjectId
- userId: ObjectId -> User
- title: required string
- topics: [{ name, status, order }]
- progressPercentage: number
- estimatedCompletion: optional Date
- createdAt, updatedAt
```

Roadmap progress is derived from the number of topics whose status is `completed`:

```text
progressPercentage = round(completedTopics / totalTopics * 100)
```

### Resource collection

```text
Resource
- _id: ObjectId
- userId: ObjectId -> User
- title: required string
- url: required string
- category: required string, default General
- isFavorite: boolean
- notes: string
- createdAt, updatedAt
```

### Snippet collection

```text
Snippet
- _id: ObjectId
- userId: ObjectId -> User
- title: required string
- language: required string, default "typescript"
- description: string
- code: required string
- tags: string[]
- isFavorite: boolean
- createdAt, updatedAt
```

### Relationships and indexing discussion

The collections are logically related through `userId`, but the current code does not use Mongoose `populate`; it fetches each user's documents directly. This is a deliberate simple ownership model.

For scale, I would add indexes such as:

- `{ userId: 1, date: -1 }` on journals
- `{ userId: 1, createdAt: -1 }` on goals, resources, and snippets
- `{ userId: 1, deadline: 1 }` on goals
- `{ userId: 1, category: 1 }` on resources
- `{ userId: 1, language: 1 }` on snippets
- `{ userId: 1, email: 1 }` or rely on the existing unique email index

I would also consider text indexes or Atlas Search for large-scale content search, because the current search uses case-insensitive regex queries.

## 7. API Surface

All responses follow the general shape `{ success, message?, data?, error? }`.

### Auth

| Method | Endpoint                    | Purpose                               | Protected                                 |
| ------ | --------------------------- | ------------------------------------- | ----------------------------------------- |
| POST   | `/api/auth/register`        | Create account and issue tokens       | No                                        |
| POST   | `/api/auth/login`           | Validate credentials and issue tokens | No                                        |
| POST   | `/api/auth/logout`          | Clear stored refresh token and cookie | No at router level, uses token if present |
| GET    | `/api/auth/me`              | Return current profile                | Yes                                       |
| PUT    | `/api/auth/profile`         | Update profile/preferences            | Yes                                       |
| PUT    | `/api/auth/change-password` | Change password                       | Yes                                       |

### Domain resources

| Resource  | List/filter          | Create                | Update                   | Delete                      |
| --------- | -------------------- | --------------------- | ------------------------ | --------------------------- |
| Journals  | `GET /api/journal`   | `POST /api/journal`   | `PUT /api/journal/:id`   | `DELETE /api/journal/:id`   |
| Goals     | `GET /api/goals`     | `POST /api/goals`     | `PUT /api/goals/:id`     | `DELETE /api/goals/:id`     |
| Roadmaps  | `GET /api/roadmaps`  | `POST /api/roadmaps`  | `PUT /api/roadmaps/:id`  | `DELETE /api/roadmaps/:id`  |
| Resources | `GET /api/resources` | `POST /api/resources` | `PUT /api/resources/:id` | `DELETE /api/resources/:id` |
| Snippets  | `GET /api/snippets`  | `POST /api/snippets`  | `PUT /api/snippets/:id`  | `DELETE /api/snippets/:id`  |

Roadmaps additionally support `PATCH /api/roadmaps/:id/topic/:topicIndex` for changing one topic's status.

Filters include:

- Journals: `search`, `tag`, `mood`, `sort`
- Goals: `type`, `status`
- Resources: `category`, `isFavorite`, `search`
- Snippets: `language`, `isFavorite`, `search`, `tag`

### Analytics and health

- `GET /api/analytics/stats` returns dashboard counters and chart data.
- `GET /api/health` returns database connectivity status and a timestamp.
- All non-health `/api` routes return HTTP 503 when the database is unavailable.

## 8. Analytics Design

The analytics controller currently loads all documents for the authenticated user from five collections:

- Journals
- Goals
- Roadmaps
- Resources
- Snippets

It then calculates the dashboard response in Node.js.

### Counters

- Total journals
- Total goals
- Completed goals
- Goal completion rate: `round(completedGoals / totalGoals * 100)`
- Current journal streak
- Longest journal streak
- Total roadmaps
- Average roadmap progress
- Total resources
- Total snippets

### Streak algorithm

1. Convert journal dates to calendar-day strings.
2. Remove duplicate days.
3. Sort days from newest to oldest.
4. The current streak is active when the newest entry is today or yesterday.
5. Walk backward through consecutive dates to count the current streak.
6. Walk through the entire sorted history to find the longest consecutive run.

A good limitation to mention: streak calculations use the server's local date behavior and `toDateString`, so a production-grade version should define an explicit timezone policy.

### Other analytics

- Mood distribution counts supported moods: focused, happy, tired, productive, stressed.
- Weekly activity covers the last seven calendar days.
- The current implementation reports `hours` as `journalCount * 2.5`, which is a product heuristic, not measured time tracking.
- Resource category distribution counts resources by category.
- Recent activities combine recent journals, completed goals, and snippets, then sort and return the latest six.

### Scalability improvement

The current approach is easy to understand but becomes expensive as a user's history grows because it fetches complete collections and computes in application memory. I would improve it with MongoDB aggregation pipelines, projections, date-range filters, pagination, and precomputed daily activity summaries. The dashboard should also query only fields needed for each metric.

## 9. Frontend Design

`src/App.jsx` controls the application shell:

- Checks `/api/health` before showing the application.
- Shows a database error view when the database is unavailable.
- Uses `AuthProvider` to restore the session.
- Displays a landing page/auth flow when unauthenticated.
- Displays a sidebar workspace when authenticated.
- Switches between Dashboard, Journals, Goals, Roadmaps, Snippets, Resources, Calendar, and Settings.

`AuthContext` owns:

- Current user
- Loading state
- Login/register/logout actions
- Theme persistence
- Session restoration through `/api/auth/me`

The domain components use local React state and the API service module. After mutations, most views refetch their list. Roadmap topic status and favorite toggles use a small local state update after the server responds.

## 10. Important End-to-End Flows

### Create a journal entry

```text
JournalView form
  -> journalService.createEntry(payload)
  -> Axios interceptor adds Bearer token
  -> POST /api/journal
  -> protect middleware
  -> createEntry controller
  -> Journal.create({ userId, title, content, ... })
  -> MongoDB
  -> response returned to component
  -> entry list refetched and selected entry updated
```

### Update roadmap topic status

```text
User clicks topic checkbox
  -> roadmapService.updateTopicStatus(id, index, newStatus)
  -> PATCH /api/roadmaps/:id/topic/:topicIndex
  -> protect middleware
  -> controller loads roadmap by _id and userId
  -> validates topic index
  -> updates topic status
  -> recalculates progressPercentage
  -> saves roadmap
  -> frontend replaces that roadmap in local state
```

### Dashboard load

```text
DashboardView mounts
  -> GET /api/analytics/stats
  -> analytics controller loads user-scoped collections
  -> computes counters and distributions
  -> Recharts renders activity and mood visualizations
  -> GET /api/goals?type=daily
  -> dashboard renders today's goal checklist
```

### Database failure behavior

```text
App starts
  -> connectDB()
  -> /api/health is called by frontend
  -> if disconnected, health returns success=false
  -> DatabaseErrorView is shown
  -> user can retry the health check
```

## 11. Strong Interview Questions and Answer Points

### Product and design

**Why did you build this project?**

I wanted to solve the fragmentation problem faced by developers who use separate tools for notes, goals, bookmarks, snippets, and learning plans. The product combines those workflows and adds analytics so the user can see consistency and progress.

**Why are journals, goals, roadmaps, resources, and snippets separate entities?**

They have different lifecycles, filters, validation rules, and UI workflows. Separate collections keep the model clear and make CRUD operations independent. Nested structures are used where they are naturally owned by the parent, such as roadmap topics and journal-attached snippets.

**What was the most technically meaningful feature?**

The dashboard analytics because it combines data from multiple collections, derives streaks and completion metrics, and exposes a response shape designed for chart rendering. The next engineering step would be moving expensive analytics into database aggregation and precomputed summaries.

### Backend

**Why Express?**

Express provides a small, explicit middleware and routing model. It was sufficient for REST APIs, authentication middleware, centralized initialization, and serving the built SPA from the same process.

**Why use controllers?**

Controllers keep route definitions focused on HTTP wiring while grouping validation, ownership checks, database operations, and response formatting by domain.

**How do you prevent one user from accessing another user's data?**

The JWT identifies the user. Every protected controller reads `req.user.id`, and every query includes that id. For item operations, the query combines `_id` and `userId`; therefore a valid id belonging to another user behaves like a missing document.

**Why use both access and refresh tokens?**

The access token is used frequently for API authorization and expires sooner. The refresh token lasts longer and is stored in an HTTP-only cookie, which reduces direct JavaScript access. The current implementation stores the refresh token on the user record, making server-side invalidation possible.

**What happens if the database is down?**

Connection state is tracked in `server/db.js`. The `/api` middleware allows health checks through but returns HTTP 503 for other API requests when there is no database connection. The frontend checks health at startup and shows a retryable error screen.

### MongoDB and data modeling

**Why MongoDB instead of a relational database?**

The entities are naturally document-shaped, and some contain nested arrays. MongoDB also makes a user-scoped document model straightforward. If reporting, complex joins, and transactional workflows became dominant, PostgreSQL would be a reasonable alternative.

**What are the tradeoffs of your schema?**

Separate user-owned collections are easy to maintain and query by domain, but cross-collection analytics is more expensive. Embedded roadmap topics and journal snippets make reads simple, but very large embedded arrays would need limits or extraction into separate collections.

**How would you improve query performance?**

Add compound indexes beginning with `userId`, use pagination and projections, replace broad regex search with text indexes or Atlas Search, and move dashboard calculations to aggregation pipelines or daily summary documents.

### Frontend

**How does the frontend handle authentication?**

`AuthContext` stores the current user and auth actions. After login/register, the access token is placed in local storage. Axios automatically adds it to outgoing requests. On reload, the context calls `/api/auth/me` to restore the session.

**Why use a shared Axios interceptor?**

It centralizes authorization header injection so individual services do not repeat token logic. It also makes the API service methods small and consistent.

**How does the dashboard get its data?**

The dashboard calls the analytics endpoint and a filtered goals endpoint on mount. It stores the results in local state and passes the resulting arrays to Recharts and the goal checklist UI.

**How is the UI responsive?**

Tailwind responsive utility classes switch the sidebar, grids, columns, spacing, and calendar layout at breakpoints. On mobile, the sidebar becomes an overlay menu.

### Testing, reliability, and future work

**How would you test this project?**

- Unit-test streak and roadmap-progress calculations with edge cases.
- Controller tests for missing input, invalid ids, unauthorized access, and successful CRUD.
- Integration tests against a test MongoDB for user isolation.
- Frontend tests for auth state restoration, form validation, filters, and optimistic updates.
- End-to-end tests for registration, journal creation, goal completion, and dashboard refresh.

**What would you improve first?**

1. Add automated tests and CI checks.
2. Add request validation with the existing Zod dependency or a similar schema layer.
3. Add pagination, indexes, and aggregation for analytics.
4. Improve token storage and implement refresh-token rotation.
5. Add centralized error middleware and structured logging.
6. Add rate limiting, since the dependency is present but not currently mounted in `server.js`.

**What is one known limitation?**

Analytics currently loads full user datasets and computes in memory. That is acceptable for a personal productivity application at small scale, but it should be redesigned before supporting users with large histories.

## 12. Rapid-Fire Technical Answers

- **API style:** REST over HTTP with JSON responses.
- **Database driver/ODM:** Mongoose.
- **Primary key:** MongoDB ObjectId.
- **Password hashing:** bcryptjs with a generated salt.
- **Authorization:** JWT Bearer access token plus user-scoped database queries.
- **UI state:** React local state plus AuthContext for cross-cutting auth/theme state.
- **Charts:** Recharts.
- **Markdown:** React Markdown for journal content.
- **Build:** Vite frontend build plus esbuild server bundle.
- **Development server:** Express with Vite middleware.
- **Production server:** Express serves `dist` and falls back to `index.html` for SPA routes.
- **Health check:** `/api/health` reports MongoDB connection state.
- **Main data consistency rule:** derived progress and status are recalculated on the server, not trusted only from the UI.

## 13. AI Interview-Coach Prompt

Use the following as a system prompt or initial instruction for an AI interview-preparation tool:

```text
You are my senior software-engineering interview coach. Prepare me to explain my DevJournal project accurately and deeply.

Project: DevJournal, a multi-user developer productivity and learning platform.
Frontend: React 19, JavaScript/JSX, Vite, Tailwind CSS, Axios, Recharts, Motion, React Markdown.
Backend: Node.js, Express, JavaScript, Mongoose, MongoDB, JWT, bcryptjs, Helmet, CORS, cookie-parser.
Architecture: one Express application serves REST APIs under /api and serves the React SPA in production. Routes call controllers; controllers use protected middleware and Mongoose models.
Models: User, Journal, Goal, Roadmap, Resource, Snippet. Every domain document has a userId and protected queries enforce ownership.
Features: journals with mood/tags/attached snippets, goals with type/priority/status/progress, roadmaps with ordered topics and derived progress, resources with category/favorite state, snippets with language/tags/favorite state, calendar, settings, and analytics dashboard.
Authentication: bcrypt password hashing, one-day JWT access token returned to the client, seven-day refresh token in an HTTP-only cookie and stored on the user. Axios adds the access token as a Bearer token.
Analytics: server loads user-scoped domain data and calculates counts, goal completion rate, current/longest journal streak, average roadmap progress, mood distribution, seven-day activity, resource categories, and recent activities.
Known limitations: analytics is currently in-memory over complete user datasets; search uses regex; access token is in localStorage; refresh rotation is not implemented; rate limiting is listed as a dependency but not mounted in the current server; tests are not present in the repository.

Rules:
1. Ask me one interview question at a time.
2. Start with a 60-second project introduction, then progress through frontend, backend, database, authentication, analytics, security, performance, testing, and tradeoffs.
3. After each answer, score accuracy, depth, clarity, and ownership from 1 to 5.
4. Identify claims that are not supported by the project facts above.
5. Ask follow-up questions like a real interviewer.
6. Prefer scenario questions: database outage, cross-user access, expired token, slow dashboard, malformed input, duplicate email, and concurrent updates.
7. When I struggle, teach the concept briefly and ask me to answer again in my own words.
8. Do not invent features. If a capability is not implemented, help me explain it as a proposed improvement instead.
```

## 14. Final Interview Strategy

Lead with the problem, then explain the architecture, then walk through one complete request flow. The most convincing sequence is:

1. User logs in.
2. React stores the access token and Axios attaches it.
3. Express verifies the JWT.
4. The controller scopes a Mongoose query by `userId`.
5. MongoDB returns the document.
6. The UI updates and analytics reflect the change.

For difficult questions, distinguish clearly between:

- What is implemented now.
- Why the current design was sufficient for the project.
- What you would change for scale, security, testing, or maintainability.

That distinction demonstrates ownership and technical judgment without overstating the codebase.
