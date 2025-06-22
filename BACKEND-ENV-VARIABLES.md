# 🔑 Backend Environment Variables for Vercel

## Vercel Dashboard Setup

**Go to**: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

## Required Environment Variables

### 1. MONGODB_URI
**Variable Name**: `MONGODB_URI`  
**Value**: `mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0`  
**Environment**: `Production`, `Preview`, `Development`  
**Description**: MongoDB Atlas connection string

### 2. JWT_SECRET
**Variable Name**: `JWT_SECRET`  
**Value**: `mailblaster-pro-jwt-secret-key-2025-secure`  
**Environment**: `Production`, `Preview`, `Development`  
**Description**: Secret key for JWT token generation

### 3. CORS_ORIGIN
**Variable Name**: `CORS_ORIGIN`  
**Value**: `https://mailsender-r7un-bwnck6t1g-raagavans-projects.vercel.app`  
**Environment**: `Production`, `Preview`, `Development`  
**Description**: Frontend URL for CORS configuration

### 4. NODE_ENV
**Variable Name**: `NODE_ENV`  
**Value**: `production`  
**Environment**: `Production`, `Preview`  
**Description**: Node.js environment mode

## Quick Copy-Paste Format

```
MONGODB_URI=mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=mailblaster-pro-jwt-secret-key-2025-secure

CORS_ORIGIN=https://mailsender-r7un-bwnck6t1g-raagavans-projects.vercel.app

NODE_ENV=production
```

## Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your backend project (likely named `mailsender` or similar)
3. Click on the project

### 2. Navigate to Environment Variables
1. Click **Settings** tab
2. Click **Environment Variables** in the left sidebar
3. Click **Add New** button

### 3. Add Each Variable
For each variable above:
1. **Name**: Enter the variable name (e.g., `MONGODB_URI`)
2. **Value**: Enter the exact value provided above
3. **Environments**: Select `Production`, `Preview`, and `Development`
4. Click **Save**

### 4. Redeploy (Important!)
After adding all variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Important Notes

⚠️ **MONGODB_URI**: Contains your actual database credentials
⚠️ **JWT_SECRET**: Use a strong, unique secret key
⚠️ **CORS_ORIGIN**: Must exactly match your frontend URL
⚠️ **Redeploy Required**: Environment variables only take effect after redeployment

## Verification

After setting variables and redeploying:

1. **Test Backend Root**: https://mailsender-lqdz-aamqfx67g-raagavans-projects.vercel.app/
   - Should show API information without errors

2. **Test Health Endpoint**: https://mailsender-lqdz-aamqfx67g-raagavans-projects.vercel.app/health
   - Should show server health status

3. **Test Frontend Connection**: https://mailsender-r7un-bwnck6t1g-raagavans-projects.vercel.app/
   - Try registering/logging in - should work without CORS errors

## Security Tips

✅ **Use Production Values**: The JWT_SECRET above is for production use
✅ **Keep Private**: Never commit these values to Git
✅ **Rotate Regularly**: Change JWT_SECRET periodically for security
✅ **MongoDB Security**: Ensure your MongoDB Atlas has proper IP restrictions

Your backend should work perfectly once these environment variables are set! 🚀
