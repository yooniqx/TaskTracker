# Task Tracker

A simple task management app I built with the MERN stack. You can register, login, add tasks, mark them complete, edit or delete them.

## What's inside

- JWT auth (login/register)
- CRUD for tasks
- Filter by status (all/pending/completed)
- Mobile-friendly UI

## Tech used

**Frontend:** React, React Router, Axios  
**Backend:** Node.js, Express, MongoDB  
**Auth:** JWT + bcrypt

## Folder structure

```
PROJECT1/
├── client/     # React app
└── server/     # API
```

## How to run

**Backend:**
```bash
cd server
npm install
npm start
```
Server runs on http://localhost:5000

**Frontend:**
```bash
cd client
npm install
npm start
```
App opens on http://localhost:3000

## Environment vars

Create `.env` in server folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasktracker
JWT_SECRET=your_secret_key
```

## API routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Sign up |
| POST | /api/auth/login | Log in |
| GET | /api/tasks | Get my tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/toggle | Toggle status |

---

Built as a practice project. Feel free to use/modify.
