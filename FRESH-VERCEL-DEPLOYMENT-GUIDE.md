# Fresh Vercel Deployment Guide for MailBlaster Pro

## 🚀 Complete Setup from Scratch

This guide will help you deploy MailBlaster Pro to Vercel with completely fresh URLs and zero CORS issues.

## Prerequisites

1. ✅ GitHub account with the MailBlaster Pro repository
2. ✅ Vercel account (free tier is sufficient)
3. ✅ MongoDB Atlas database with email credentials stored

## Step 1: Deploy Backend to Vercel

### 1.1 Create New Vercel Project for Backend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Change the project name to something unique like:
   - `mailblaster-pro-backend-2025`
   - `mailsender-backend-v2`
   - `bulk-mail-api-new`

### 1.2 Configure Backend Deployment

1. **Root Directory**: Set to `backend`
2. **Framework Preset**: Other
3. **Build Command**: Leave empty
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### 1.3 Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-here-2025
MONGODB_URI=mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0
```

### 1.4 Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note your new backend URL: `https://YOUR-NEW-BACKEND.vercel.app`
4. Test it by visiting: `https://YOUR-NEW-BACKEND.vercel.app/health`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create New Vercel Project for Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import the SAME GitHub repository again
4. **Important**: Change the project name to something unique like:
   - `mailblaster-pro-frontend-2025`
   - `mailsender-frontend-v2`
   - `bulk-mail-ui-new`

### 2.2 Configure Frontend Deployment

1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 2.3 Set Frontend Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
VITE_API_URL=https://YOUR-NEW-BACKEND.vercel.app
```

**Replace `YOUR-NEW-BACKEND` with the actual backend URL from Step 1.4**

### 2.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note your new frontend URL: `https://YOUR-NEW-FRONTEND.vercel.app`

## Step 3: Verify Everything Works

### 3.1 Test Backend Endpoints

1. **Health Check**: `https://YOUR-NEW-BACKEND.vercel.app/health`
2. **Root Info**: `https://YOUR-NEW-BACKEND.vercel.app/`
3. Both should return JSON responses without CORS errors

### 3.2 Test Frontend Application

1. Open: `https://YOUR-NEW-FRONTEND.vercel.app`
2. Try to register a new account
3. Try to login
4. Test sending an email

### 3.3 Check Browser Developer Tools

1. Open Network tab
2. Look for any CORS errors (there should be none!)
3. Verify API calls are going to the correct backend URL

## Step 4: Clean Up Old Deployments (Optional)

Once the new deployment works perfectly:

1. Go to your old Vercel projects
2. Delete or disable them to avoid confusion
3. Update any bookmarks to the new URLs

## Troubleshooting

### Problem: Still getting CORS errors
**Solution**: 
- Verify the frontend environment variable is set correctly
- Check that you're not mixing old and new URLs
- Clear browser cache and try in incognito mode

### Problem: Backend not connecting to MongoDB
**Solution**: 
- Verify the MONGODB_URI environment variable is set correctly
- Check that your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Problem: Email sending not working
**Solution**: 
- Verify your MongoDB has the email credentials in the 'bulkmail' collection
- Check that the Gmail app password is still valid

## Security Notes

The current CORS configuration allows all origins for maximum compatibility. Once everything is working, you can update the backend to only allow your specific frontend URL for better security.

## Final Verification Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works
- [ ] Email sending works
- [ ] No CORS errors in browser console
- [ ] All API calls use the correct backend URL

## Your New URLs

✅ **DEPLOYED SUCCESSFULLY**

- **Backend**: `https://mailsender-sand.vercel.app`
- **Frontend**: `https://mailsender-x8cv.vercel.app`

### Quick Test Links:
- Backend Health: https://mailsender-sand.vercel.app/health
- Backend API Info: https://mailsender-sand.vercel.app/
- Frontend Application: https://mailsender-x8cv.vercel.app/

---

**Note**: This deployment uses ultra-permissive CORS settings to eliminate all CORS issues. The backend will accept requests from any origin, which is perfect for development and initial deployment.
