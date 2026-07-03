# 🌐 Deploying Frontend on Vercel

Follow these simple steps to deploy the static React frontend of Malwa Sports Academy on **Vercel**:

### 1. Account & Project Setup
1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.

### 2. Configure Build & Development Settings
Under the **Build and Output Settings** dropdown:
* **Framework Preset**: `Vite` (Vercel will auto-detect this).
* **Build Command**: `npm run build:client` (This builds only the static React frontend).
* **Output Directory**: `dist` (This is where Vite outputs the production build).
* **Install Command**: `npm install`

### 3. Environment Variables
In the **Environment Variables** section, add the following key-value pair:
* **Key**: `VITE_API_URL`
* **Value**: `https://your-backend-on-render.onrender.com` *(Replace this with the live URL of your backend deployed on Render)*

### 4. Click Deploy!
Vercel will fetch the repository, install dependencies, run `npm run build:client`, and host your frontend on a secure `https://...` domain.
