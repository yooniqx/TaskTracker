# 🚀 Quick Start Guide

Get your Task Tracker app running in 5 minutes!

## ⚠️ Important: MongoDB Setup Required

The app is currently configured with a **local MongoDB connection** which won't work unless you have MongoDB installed locally. You have two options:

### Option 1: Use MongoDB Atlas (Recommended - Free & Easy)

1. **Create Free MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (it's free, no credit card needed)

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select your preferred region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `tasktracker`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://tasktracker:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update Your .env File**
   - Open `server/.env`
   - Replace the `MONGODB_URI` line with your connection string
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://tasktracker:yourpassword@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority`

### Option 2: Install MongoDB Locally

If you prefer to run MongoDB on your machine:

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install and start MongoDB service
# The default connection string in .env should work
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## 🏃 Running the App

Once MongoDB is configured:

1. **Install Dependencies** (if not done already)
   ```bash
   npm run install:all
   ```

2. **Start Both Servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend on http://localhost:5000
   - Frontend on http://localhost:3000

3. **Open Your Browser**
   - Go to http://localhost:3000
   - Click "Register" to create an account
   - Start managing your tasks!

## ✅ Verify Everything Works

1. **Check Backend Health**
   - Open: http://localhost:5000/health
   - Should see: `{"status":"ok",...}`

2. **Check Frontend**
   - Open: http://localhost:3000
   - Should see the login page

3. **Test Registration**
   - Click "Register"
   - Fill in the form
   - Should redirect to dashboard after successful registration

## 🐛 Troubleshooting

### "MongoDB Connection Error"
- **Solution**: Make sure you've updated `MONGODB_URI` in `server/.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Verify your password doesn't contain special characters that need URL encoding

### "Cannot find module 'helmet'" or similar
- **Solution**: Run `npm install` in the server directory
  ```bash
  cd server
  npm install
  cd ..
  ```

### Frontend shows "Network Error"
- **Solution**: Make sure backend is running on port 5000
- Check `client/.env` has `REACT_APP_API_URL=http://localhost:5000/api`

### Port 5000 or 3000 already in use
- **Solution**: Kill the process or change the port
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

## 📝 Default Configuration

The app comes with these default settings in `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasktracker  # ⚠️ UPDATE THIS
JWT_SECRET=dev_secret_key_change_in_production_12345678
ALLOWED_ORIGINS=http://localhost:3000
```

**⚠️ Important**: You MUST update `MONGODB_URI` with your MongoDB Atlas connection string or local MongoDB URL.

## 🎯 Next Steps

After getting the app running:

1. ✅ Test all features (register, login, create/edit/delete tasks)
2. ✅ Read `README.md` for full documentation
3. ✅ Read `DEPLOYMENT.md` when ready to deploy to production
4. ✅ Check `CHANGES.md` to see what was improved

## 💡 Tips

- **Development**: The app auto-reloads when you make changes
- **Backend logs**: Check the terminal running the server for API logs
- **Frontend errors**: Open browser DevTools (F12) to see console errors
- **Database**: View your data in MongoDB Atlas dashboard

## 🆘 Still Having Issues?

1. Make sure Node.js version is 16 or higher: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules server/node_modules client/node_modules
   npm run install:all
   ```
4. Check if all environment files exist:
   - `server/.env` ✓
   - `client/.env` ✓

## 📞 Need Help?

- Check the error message carefully
- Search the error on Google/Stack Overflow
- Review the troubleshooting sections in README.md
- Open an issue on GitHub with:
  - Error message
  - Steps to reproduce
  - Your environment (OS, Node version)

---

**Happy Coding! 🎉**