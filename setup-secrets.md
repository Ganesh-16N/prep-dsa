# 🔧 GitHub Secrets Setup for CI/CD

To complete the CI/CD setup, you need to add the following secrets to your GitHub repository:

## 📍 Repository: https://github.com/Ganesh-16N/prep-dsa

## 🔑 Required Secrets

### 1. VERCEL_TOKEN
- **How to get it:**
  1. Go to https://vercel.com/account/tokens
  2. Click "Create Token"
  3. Name: "GitHub Actions CI/CD"
  4. Copy the token

### 2. VERCEL_ORG_ID
- **Value:** `ganesh16ns-projects`
- **Source:** From the project listing above

### 3. VERCEL_PROJECT_ID
- **Value:** `prj_y3cibRcaQofw8o6weip8oAlHMvyY`
- **Source:** From the project inspection above

## 🚀 How to Add Secrets

1. Go to your repository: https://github.com/Ganesh-16N/prep-dsa
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the exact names above

## ✅ After Adding Secrets

Once you add these secrets, your CI/CD pipeline will:
- ✅ Run on every push to main branch
- ✅ Run linting and type checking
- ✅ Build the project
- ✅ Deploy to Vercel automatically
- ✅ Update your live site: https://prep-dsa.vercel.app

## 🔄 Workflow

1. **Push to GitHub** → Triggers CI/CD
2. **GitHub Actions** → Runs tests and builds
3. **Vercel Deploy** → Updates live site
4. **Live Site** → https://prep-dsa.vercel.app

Your password-protected DSA Learning Hub will be automatically updated on every push! 🎉 