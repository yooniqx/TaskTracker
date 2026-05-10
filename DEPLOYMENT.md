# 🚀 Deployment Guide

Complete guide for deploying Task Tracker to production on Cloudflare and other platforms.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables documented
- [ ] Frontend built and tested
- [ ] Backend tested with production environment variables
- [ ] Security headers configured
- [ ] CORS origins configured for production
- [ ] Rate limiting configured
- [ ] All dependencies installed

## 🗄️ MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and database name
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority`

## 🌐 Frontend Deployment (Cloudflare Pages)

### Option 1: Deploy via GitHub (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Navigate to "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `cd client && npm install && npm run build`
     - **Build output directory**: `client/build`
     - **Root directory**: `/` (leave empty)

3. **Set Environment Variables**
   - In Cloudflare Pages settings, go to "Environment variables"
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
   - Save and redeploy

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

4. **Deploy**
   ```bash
   wrangler pages deploy client/build --project-name=task-tracker
   ```

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended - Easy & Free Tier)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect Node.js
   - Set root directory to `server`
   - Or add `railway.json` in server folder:
     ```json
     {
       "build": {
         "builder": "NIXPACKS"
       },
       "deploy": {
         "startCommand": "npm start",
         "restartPolicyType": "ON_FAILURE",
         "restartPolicyMaxRetries": 10
       }
     }
     ```

4. **Add Environment Variables**
   - Go to your service → "Variables"
   - Add all required variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_production_secret_key
     ALLOWED_ORIGINS=https://your-frontend-url.pages.dev
     RATE_LIMIT_WINDOW_MS=900000
     RATE_LIMIT_MAX_REQUESTS=100
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL from the deployment
   - Update frontend `REACT_APP_API_URL` with this URL

### Option 2: Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: task-tracker-api
     - **Root Directory**: `server`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   - In "Environment" tab, add all variables
   - Same as Railway setup above

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy the service URL

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create task-tracker-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_connection_string"
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set ALLOWED_ORIGINS="https://your-frontend.pages.dev"
   ```

5. **Create Procfile** in server directory:
   ```
   web: node server.js
   ```

6. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create DigitalOcean Account**
   - Go to https://www.digitalocean.com

2. **Create App**
   - Go to "Apps" → "Create App"
   - Connect GitHub repository
   - Select repository and branch

3. **Configure Component**
   - **Type**: Web Service
   - **Source Directory**: `/server`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: 5000

4. **Add Environment Variables**
   - Add all required variables in the environment section

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

## 🔗 Connect Frontend to Backend

After deploying both frontend and backend:

1. **Update Frontend Environment Variable**
   - In Cloudflare Pages settings
   - Update `REACT_APP_API_URL` to your backend URL
   - Example: `https://task-tracker-api.railway.app/api`
   - Redeploy frontend

2. **Update Backend CORS**
   - In your backend hosting platform
   - Update `ALLOWED_ORIGINS` to your frontend URL
   - Example: `https://task-tracker.pages.dev`
   - Redeploy backend

3. **Test the Connection**
   - Visit your frontend URL
   - Try to register/login
   - Create a task
   - Verify everything works

## 🔍 Verification Steps

1. **Health Check**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "uptime": 123.456,
     "environment": "production"
   }
   ```

2. **Test Registration**
   - Go to your frontend URL
   - Click "Register"
   - Create a test account
   - Verify you can login

3. **Test Task Operations**
   - Create a task
   - Edit a task
   - Toggle task status
   - Delete a task

4. **Check Browser Console**
   - Open DevTools (F12)
   - Check for any errors
   - Verify API calls are successful

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: "Network Error" or "Failed to fetch"
- **Solution**: Check `REACT_APP_API_URL` is correct
- Verify backend is running
- Check CORS settings on backend

**Issue**: Blank page after deployment
- **Solution**: Check browser console for errors
- Verify build completed successfully
- Check if all environment variables are set

### Backend Issues

**Issue**: "MongoDB connection failed"
- **Solution**: Verify MongoDB URI is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure connection string includes database name

**Issue**: "CORS error"
- **Solution**: Add frontend URL to `ALLOWED_ORIGINS`
- Format: `https://your-app.pages.dev` (no trailing slash)
- Redeploy backend after changing

**Issue**: "JWT token invalid"
- **Solution**: Verify `JWT_SECRET` is set
- Clear browser localStorage
- Try logging in again

## 📊 Monitoring

### Cloudflare Pages
- View analytics in Cloudflare dashboard
- Check deployment logs
- Monitor bandwidth usage

### Backend Hosting
- **Railway**: View logs in dashboard
- **Render**: Check metrics and logs
- **Heroku**: Use `heroku logs --tail`

### MongoDB Atlas
- Monitor database performance
- Check connection metrics
- Set up alerts for issues

## 🔒 Security Best Practices

1. **Use Strong Secrets**
   - Generate strong JWT_SECRET: `openssl rand -base64 32`
   - Never commit secrets to Git

2. **Enable HTTPS**
   - Both platforms provide free SSL
   - Ensure all URLs use `https://`

3. **Limit CORS Origins**
   - Only allow your frontend domain
   - Don't use `*` in production

4. **Monitor Rate Limits**
   - Adjust based on your traffic
   - Set up alerts for abuse

5. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

## 💰 Cost Estimates

### Free Tier Limits

**Cloudflare Pages**
- Unlimited requests
- 500 builds per month
- 20,000 files per deployment

**Railway**
- $5 free credit per month
- ~500 hours of runtime

**Render**
- Free tier available
- 750 hours per month
- Sleeps after 15 min inactivity

**MongoDB Atlas**
- 512 MB storage
- Shared RAM
- No credit card required

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   - Add custom domain in Cloudflare Pages
   - Update CORS settings

2. **Monitoring**
   - Set up error tracking (Sentry)
   - Add analytics (Google Analytics)

3. **Backups**
   - Enable MongoDB Atlas backups
   - Export data regularly

4. **Performance**
   - Enable Cloudflare caching
   - Optimize images
   - Monitor load times

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Open an issue on GitHub
4. Contact platform support

---

**Happy Deploying! 🚀**