# 🎨 MailBlaster Pro Frontend - Vercel Deployment

## Quick Deploy to Vercel

### Step 1: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" 
3. Import your GitHub repository
4. **Set Root Directory to: `frontend`**
5. Framework will be auto-detected as "Vite"
6. Click "Deploy"

### Step 2: Environment Variables
Add this in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-project.vercel.app
```

**Important:** Replace `your-backend-project.vercel.app` with your actual backend URL from Step 1.

### Step 3: Test Frontend
After deployment, your frontend will be available at:
```
https://your-frontend-project.vercel.app
```

## 🔗 Connecting Frontend to Backend

1. **Deploy Backend First** (see backend/README.md)
2. **Get Backend URL** from Vercel dashboard
3. **Update Frontend Environment Variable**:
   - Go to Frontend project in Vercel
   - Settings → Environment Variables
   - Set `VITE_API_URL` to your backend URL
4. **Redeploy Frontend** to apply changes

## 🧪 Testing the Connection

1. Visit your frontend URL
2. Try to register a new admin account
3. Login with your credentials
4. Test sending an email campaign
5. Check the browser console for any API errors

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure backend `CORS_ORIGIN` is set to `*` or your frontend domain
2. **API Not Found**: Verify the `VITE_API_URL` is correct
3. **Login Issues**: Check if backend MongoDB and JWT are configured properly

### Environment Variables:
- Frontend needs: `VITE_API_URL`
- Backend needs: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`

Your frontend will be ready to connect to your deployed backend!
