# ⚙️ Deploying Backend on Render

Follow these simple steps to deploy the Node.js Express & MongoDB backend of Malwa Sports Academy on **Render**:

### 1. Account & Web Service Setup
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.

### 2. Configure Service Settings
Specify the following configuration:
* **Name**: `malwa-sports-academy-backend`
* **Language/Runtime**: `Node`
* **Branch**: `main` (or your preferred branch)
* **Build Command**: `npm run build:server` (This bundles the TypeScript Express server into a single file `dist/server.cjs` using `esbuild`).
* **Start Command**: `npm run start` (This launches the compiled backend using `node dist/server.cjs`).

### 3. Environment Variables
Add the following secret environment variables in the **Environment Variables** (or Advanced) section:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Set to `production` |
| `GEMINI_API_KEY` | Your Google Gemini API Key for AI Coaching queries |
| `MONGODB_URI` | Your live MongoDB Connection string (Atlas or Render database) |
| `SENDGRID_API_KEY` | SendGrid API key for transactional email delivery via the REST API |
| `SMTP_HOST` | SMTP host for fallback delivery (typically `smtp.sendgrid.net`) |
| `SMTP_PORT` | Port of SMTP server (usually 587 or 465) |
| `SMTP_USER` | SMTP username for fallback delivery (usually `apikey`) |
| `SMTP_PASS` | SMTP password for fallback delivery, usually the same SendGrid API key |
| `SMTP_FROM` | From email headers, e.g. `"Malwa Sports Academy" <no-reply@domain.com>` |
| `ADMIN_EMAIL` | Administrative email receiving system contact messages |

### 4. Click Deploy Web Service!
Render will provision a secure container, install npm packages, compile your TypeScript server, open port 3000 (standard), and assign a public URL (e.g. `https://malwa-sports-academy-backend.onrender.com`).
