# Task Management Application

A full-stack task management app built with Next.js, ASP.NET Core Web API, MySQL, and Firebase Authentication.

---

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: ASP.NET Core Web API (.NET 10)
- **Database**: MySQL (via Entity Framework Core + Pomelo)
- **Auth**: Firebase Email/Password Authentication

---

## Project Structure

```
TaskManagement/
├── frontend/          # Next.js app
└── TaskManagerApi/    # ASP.NET Core Web API
```

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [MySQL 8+](https://dev.mysql.com/downloads/)
- A [Firebase project](https://console.firebase.google.com/) with Email/Password auth enabled

---

## Backend Setup (ASP.NET Core)

### 1. Configure the database connection

Open `TaskManagerApi/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=taskDB;user=root;password=YOUR_PASSWORD"
  },
  "AllowedOrigins": ["http://localhost:3000"]
}
```

### 2. Create the MySQL database

```sql
CREATE DATABASE taskDB;
```

### 3. Apply migrations

```bash
cd TaskManagerApi
dotnet ef database update
```

### 4. Run the API

```bash
dotnet run
```

The API will be available at `http://localhost:5204`.  
Swagger UI: `http://localhost:5204/swagger`

### API Endpoints

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| GET    | /api/tasks?uid={uid}| Get all tasks for a user     |
| POST   | /api/tasks          | Create a new task            |
| PUT    | /api/tasks/{id}     | Update a task                |
| DELETE | /api/tasks/{id}     | Delete a task                |

---

## Frontend Setup (Next.js)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5204/api
```

> Firebase config is already set in `lib/firebase.ts`. If you use your own Firebase project, update the config values there.

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Deploying the Frontend to Vercel

### 1. Push your code to GitHub

Make sure both `frontend/` and `TaskManagerApi/` are pushed to a public GitHub repository.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Set the **Root Directory** to `frontend`
4. Add the following **Environment Variable** in Vercel project settings:

   | Name                  | Value                                  |
   |-----------------------|----------------------------------------|
   | `NEXT_PUBLIC_API_URL` | `https://your-deployed-backend-url/api`|

5. Click **Deploy**

> ⚠️ You must deploy your backend to a public URL (e.g., Railway, Render, Azure App Service) before deploying the frontend. Vercel cannot reach `localhost`.

---

## Common Vercel Deployment Errors & Fixes

### ❌ API calls fail in production (tasks don't load)

**Cause**: `NEXT_PUBLIC_API_URL` is not set in Vercel, so the app falls back to `http://localhost:5204/api` which is unreachable from Vercel.

**Fix**: In your Vercel project → Settings → Environment Variables, add:
```
NEXT_PUBLIC_API_URL = https://your-deployed-backend-url/api
```
Then redeploy.

---

### ❌ CORS error in browser console

**Cause**: Your backend's `AllowedOrigins` does not include your Vercel URL.

**Fix**: In `TaskManagerApi/appsettings.json` (on your deployed backend), update:
```json
"AllowedOrigins": ["https://your-app.vercel.app"]
```
Then restart the backend.

---

### ❌ Build fails with TypeScript errors

**Fix**: Run locally first to catch errors:
```bash
cd frontend
npm run build
```
Fix any errors before pushing to GitHub.

---

### ❌ Firebase auth works locally but not on Vercel

**Cause**: Firebase authorized domains doesn't include your Vercel URL.

**Fix**:
1. Go to [Firebase Console](https://console.firebase.google.com/) → Authentication → Settings → Authorized domains
2. Add your Vercel domain: `your-app.vercel.app`

---

## Deploying the Backend

You can host the ASP.NET Core API on any of these free/cheap platforms:

### Option A: Railway
1. Push `TaskManagerApi/` to GitHub
2. Create a new project on [railway.app](https://railway.app)
3. Add a MySQL plugin and copy the connection string
4. Set environment variable: `ConnectionStrings__DefaultConnection=<your-railway-mysql-url>`
5. Railway auto-detects .NET and deploys

### Option B: Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root to `TaskManagerApi/`
3. Build command: `dotnet publish -c Release -o out`
4. Start command: `dotnet out/TaskManagerApi.dll`
5. Add environment variables for the connection string

### Option C: Azure App Service (Free Tier)
```bash
az webapp up --name your-api-name --resource-group myRG --runtime "DOTNET:10"
```

---

## Environment Variables Summary

### Frontend (`frontend/.env.local` for local, set in Vercel for production)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API        |

### Backend (`appsettings.json` or environment variables)

| Variable                                  | Description              |
|-------------------------------------------|--------------------------|
| `ConnectionStrings__DefaultConnection`    | MySQL connection string  |
| `AllowedOrigins`                          | Frontend URL(s) for CORS |
