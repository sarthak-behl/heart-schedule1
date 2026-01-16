# Push HeartSchedule to GitHub

Follow these steps to push your project to GitHub:

## Option 1: Using GitHub CLI (Recommended)

### Step 1: Authenticate with GitHub
```bash
gh auth login
```

Follow the prompts:
1. Select "GitHub.com"
2. Choose "HTTPS" as protocol
3. Authenticate with your preferred method (browser recommended)

### Step 2: Create Repository and Push
```bash
# Create the repository on GitHub (public)
gh repo create HeartSchedule --public --source=. --remote=origin --push

# Or create as private repository
gh repo create HeartSchedule --private --source=. --remote=origin --push
```

That's it! Your repository is now on GitHub.

---

## Option 2: Using GitHub Web Interface

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `HeartSchedule`
3. Description: "Never miss a heartfelt moment - Schedule emotional messages for special occasions"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push Your Code
GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/sarthak-behl/HeartSchedule.git remote add origin https://github.com/sarthak-behl/HeartSchedule.git

# Push your code
git branch -M main
git push -u origin main
```

---

## Verify Push

After pushing, verify your code is on GitHub:

```bash
# Open repository in browser
gh repo view --web

# Or manually visit:
# https://github.com/sarthak-behl/HeartSchedule
```

---

## Next Steps After Pushing

### 1. Add GitHub Secrets for Actions

Go to your repository settings and add secrets:

**Settings → Secrets and variables → Actions → New repository secret**

Add these two secrets:

#### Secret 1: `APP_URL`
- **Name**: `APP_URL`
- **Value**: Your production URL (e.g., `https://heartschedule.vercel.app`)

#### Secret 2: `CRON_SECRET`
- **Name**: `CRON_SECRET`
- **Value**: `yKDFPLiXD5vR3ipkOqb6qkFQjki+yQQr9oEPJXqYL6g=`

### 2. Deploy to Production

Deploy to Vercel (or your preferred platform):

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy
vercel --prod
```

When deploying, add these environment variables in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `RESEND_API_KEY`
- `OPENROUTER_API_KEY`
- `CRON_SECRET`
- `FROM_EMAIL`
- `FROM_NAME`

### 3. Test the Complete Flow

1. Visit your production URL
2. Create an account
3. Schedule a test message for 5-10 minutes from now
4. Wait for GitHub Actions to run
5. Check email inbox
6. Verify message shows as "Sent" in dashboard

---

## Troubleshooting

### Authentication Failed
If `gh auth login` fails, try:
```bash
gh auth logout
gh auth login
```

### Remote Already Exists
If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/sarthak-behl/HeartSchedule.git
```

### Push Failed
If push fails due to authentication:
```bash
# Use personal access token
# Generate one at: https://github.com/settings/tokens
git push https://YOUR_TOKEN@github.com/sarthak-behl/HeartSchedule.git main
```

---

## Repository Information

- **Repository Name**: HeartSchedule
- **Username**: sarthak-behl
- **URL**: https://github.com/sarthak-behl/HeartSchedule
- **Description**: Never miss a heartfelt moment - Schedule emotional messages for special occasions

---

## Current Git Status

✅ Repository initialized
✅ All files committed
✅ .gitignore configured (secrets excluded)
✅ Ready to push

Just choose an option above and follow the steps!
