🎯 TaskCraft – Minimal Task Management App

TaskCraft is a modern, real-time task management application built with React, Django REST API, and PostgreSQL, designed for efficient task creation, tracking, and completion.

✨ Features

Add, Edit, Delete Tasks – Full CRUD functionality with real-time updates

Mark as Done / Undo – Completed tasks can be hidden and restored

Priority & Due Date – Assign priority levels and due dates for tasks

Category Organization – Categorize tasks for better management

Live Stats & Filtering – Filter tasks by status, due date, or category

Responsive Design – Works on mobile, tablet, and desktop

Dockerized – Easy deployment with Docker Compose

🏗️ Project Structure
TaskCraft/
├── frontend/          # React + Vite (port 5173)
│   ├── src/components/
│   │      Header.jsx, Footer.jsx, Stats.jsx,
│   │      TaskForm.jsx, TaskList.jsx, TaskCard.jsx, EditTaskModal.jsx
│   ├── src/App.jsx
│   ├── src/index.css
│   └── package.json
├── backend/           # Django REST API (port 8000)
│   ├── taskcraft/
│   │      settings.py, urls.py
│   ├── tasks/
│   │      models.py, serializers.py, views.py, urls.py
│   └── manage.py
├── docker-compose.yml # Orchestration of all components

🚀 Quick Start
Prerequisites

Node.js 18+

Python 3.10+

PostgreSQL 14+ (local or Docker)

1. Clone the Repository
git clone <repository-url>
cd TaskCraft

2. Backend Setup
cd backend
pip install -r requirements.txt
# Configure `.env` for database settings
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

3. Frontend Setup
cd ../frontend
npm install
npm run dev

4. Access the App

Frontend: http://localhost:5173

API: http://localhost:8000/api/

🐳 Docker Deployment

Run all components with one command:

docker-compose up --build


Frontend: port 5173

Backend API: port 8000

PostgreSQL: port 5432

Stop containers:

docker-compose down

📊 Database Schema

tasks_task table

Field	Type	Notes
id	SERIAL PK	
title	VARCHAR(255)	
description	TEXT	Optional
is_completed	BOOLEAN	Default: False
priority	VARCHAR(10)	low/medium/high/urgent
category	VARCHAR(20)	work/personal/...
due_date	TIMESTAMP	Nullable
created_at	TIMESTAMP	Default: now
updated_at	TIMESTAMP	Auto-updated
🔌 Main API Endpoints
Endpoint	Description
GET /api/tasks/	Latest uncompleted tasks (paged)
POST /api/tasks/	Create new task
PATCH /api/tasks/<id>/done/	Mark as done
PATCH /api/tasks/<id>/undo/	Undo done
PATCH /api/tasks/<id>/	Edit task
DELETE /api/tasks/<id>/	Delete task
GET /api/tasks/completed/	Only completed tasks
GET /api/tasks/overdue/	Only overdue tasks
🧪 Testing
Backend
python manage.py test

Frontend
npm test

🔧 Environment Variables

Create a backend/.env file:

DEBUG=1
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432


Docker-compose sets these variables automatically.

📱 Accessibility & Mobile

Fully responsive for all screen sizes

Supports touch and keyboard navigation

Built with ❤️ by Sangavi – TaskCraft
