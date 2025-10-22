# 🎯 TaskCraft – Premium Minimal Task Management

> **“Less, but better.”**  
> Inspired by Dieter Rams’ design and modern iconography.

TaskCraft is a modern, real-time task management application built with React, Django REST API, and PostgreSQL, designed for efficient task creation, tracking, and completion.

---

## ✨ Features

- **Stunning Premium UI-** Clean, modern, isometric-inspired visuals (Dieter Rams × Airbnb 2024 style)
- **Add, Edit, Delete Tasks-** Full CRUD with real-time optimistic updates
- **Due Date & Priority-** Set, view, and sort by priority and due date/time
- **Category Organization-** Assign tasks to categories (Work, Personal, Learning, etc)
- **Mark as Done/Undo-** Hide completed items with UNDO
- **Live Stats & Filtering-** Instantly see overdue, complete, and today’s tasks
- **Fully Responsive-** App-quality UX on mobile, tablet, desktop
- **Fast-** Lightning-quick React frontend, efficient Django/Pg backend
- **Dockerized-** Easily run full stack with Docker Compose

---

## 🏗️ Project Structure

```
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
├── docker-compose.yml # All-in-one orchestration
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (`node -v`)
- Python 3.10+ (`python --version`)
- PostgreSQL 14+ (working locally, or Docker)

### 1. Clone the Repo

```bash
git clone <repository-url>
cd TaskCraft
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Fill or update `.env` for database settings
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Use the App

- **Frontend-** http://localhost:5173
- **API-** http://localhost:8000/api/

---

## 🐳 Docker Deployment

**One-liner to run all-**
```bash
docker-compose up --build
```

- **Frontend-** port 5173
- **Backend API-** port 8000
- **Postgres-** port 5432
- Stop- `docker-compose down`

---

## 📊 Database Schema

**tasks_task table**
| Field        | Type         | Notes                      |
| ------------ | ------------ | -------------------------- |
| id           | SERIAL PK    |                            |
| title        | VARCHAR(255) |                            |
| description  | TEXT (null)  | optional                   |
| is_completed | BOOLEAN      | default False              |
| priority     | VARCHAR(10)  | low/medium/high/urgent     |
| category     | VARCHAR(20)  | work/personal/…            |
| due_date     | TIMESTAMP    | nullable                   |
| created_at   | TIMESTAMP    | default now                |
| updated_at   | TIMESTAMP    | auto updated               |

---

## 🔌 Main API Endpoints

| Endpoint                       | Description                      |
| ------------------------------ | -------------------------------- |
| `GET /api/tasks/`              | Latest uncompleted tasks (paged) |
| `POST /api/tasks/`             | Create new task                  |
| `PATCH /api/tasks/<id>/done/`  | Mark as done                     |
| `PATCH /api/tasks/<id>/undo/`  | Undo done                        |
| `PATCH /api/tasks/<id>/`       | Edit task                        |
| `DELETE /api/tasks/<id>/`      | Delete task                      |
| `GET /api/tasks/completed/`    | Only completed                   |
| `GET /api/tasks/overdue/`      | Only overdue, incomplete         |

**Pagination/search/sort supported by DRF.**

---

## 🎨 Visual Design

- **Design Language-** Dieter Rams × Airbnb, modern isometric emojis/icons
- **Palette-** Warm grays, whites, soft primary accents
- **Layout-** Minimal, tactile, subtle glass and shadow; natural-rounded cards
- **Responsive-** Optimizes for all screen sizes
- **Footer/Header-** Premium, minimal, always visible

---

## 🧪 Testing

### Backend

```bash
python manage.py test
```

### Frontend

```bash
npm test
```

---

## 🔧 Environment Variables

Create a `backend/.env` (or configure in settings):

```
DEBUG=1
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```
For Docker, these are set in `docker-compose.yml`.

---

## 📱 Mobile & Accessibility

- **Touch-** All actions easily performed by tap/long-press
- **Keyboard-** Full navigation
- **Responsive UI-** Adapts layout for narrow screens

---

## 🙏 Credits

- Dieter Rams (“Less, but better” inspiration)
- Airbnb design language
- Django, React, PostgreSQL communities
- Tailwind CSS

---


**Built with ❤️ by Sangavi – TaskCraft- Where elegance meets efficiency.**
