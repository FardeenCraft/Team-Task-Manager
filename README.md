TEAM TASK MANAGER (FULL-STACK PROJECT)


Project Overview
Team Task Manager is a full-stack web application that allows users to create projects, assign tasks, and track progress with role-based access control (Admin and Member).


Features

Authentication
- User Signup & Login
- JWT-based authentication
- Role-based access (Admin / Member)

Project Management
- Admin can create projects
- Assign team members to projects
- Members can view only assigned projects

Task Management
- Admin can create tasks
- Assign tasks to members
- Members can mark tasks as Done
- Task status tracking (Todo / In Progress / Done)
- Delete tasks and projects

Dashboard
- Admin Dashboard (all projects & tasks)
- Member Dashboard (assigned tasks only)
- Overdue task detection
- Task statistics (Total / Completed / Overdue)


Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Atlas)
- Mongoose

Authentication:
- JWT (JSON Web Token)

Deployment:
- Render(Backend)
-Netlify(Frontend)



 Installation & Setup

1. Clone the repository
git clone <your-github-repo-url>

2. Backend Setup
cd backend
npm install

Create .env file:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend:
npm start

3. Frontend Setup
cd frontend
npm install

Create .env file:
VITE_API_URL=https://team-task-manager-production-c176.up.railway.app

Run frontend:
npm run dev



API Endpoints

Auth:
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/users

Projects:
POST /api/projects
GET /api/projects
DELETE /api/projects/:id

Tasks:
POST /api/tasks
GET /api/tasks
PATCH /api/tasks/:id
DELETE /api/tasks/:id


 Admin Flow
1. Login as Admin
2. Create Project
3. Assign Members
4. Create Tasks
5. Monitor progress

Member Flow
1. Login as Member
2. View assigned projects
3. View assigned tasks
4. Mark tasks as Done
5. Track overdue tasks


 Key Highlights
- Role-based access control
- Real-time task updates
- Overdue task tracking
- Clean UI with Tailwind CSS
- Fully deployed full-stack application


