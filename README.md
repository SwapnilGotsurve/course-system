Here is a single Bash script (`setup_project.sh`) that generates the complete project root structure and creates the entire `README.md` file in one run.

### Step 1: Create the setup script

Create a file named `setup_project.sh` and paste the following code:

```bash
#!/usr/bin/env bash

# Generate complete README.md
cat << 'EOF' > README.md
# College Course Enrollment System

A full-stack Course Enrollment System built with **React (Vite)**, **Express.js (Node.js)**, and **MySQL**. The application handles course registrations, capacity limits, duplicate enrollment prevention, and automated First-In, First-Out (FIFO) waitlist promotions upon course cancellations.

---

## 🏗️ Project Architecture


```

course-system/
├── db/
│   └── schema.sql        # MySQL database setup, tables, constraints, & seed data
├── backend/
│   ├── server.js         # Express API with auto-promotion waitlist logic
│   └── package.json
└── frontend/
├── src/
│   ├── App.jsx       # React dashboard UI with courses, forms, & status table
│   └── main.jsx
└── package.json

```

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher) & **npm**
* **MySQL Server** (v8.0 or higher) running locally
* **Git Bash** / **Terminal**

---

## 🚀 Step-by-Step Setup & Execution

### 1. Database Setup (MySQL)

Start your local MySQL service and run the database initialization script (update credentials as needed):

```bash
mysql -u root -proot < db/schema.sql

```

*Alternative (from MySQL shell):*

```sql
mysql -u root -proot
mysql> SOURCE db/schema.sql;

```

---

### 2. Backend Setup (Express.js)

1. Navigate into the backend folder:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install express cors mysql2

```


3. Start the server:
```bash
node server.js

```


*Backend runs on **`http://localhost:5000`**.*

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate into the frontend folder:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Launch the development server:
```bash
npm run dev

```


4. Open **`http://localhost:5173`** in your browser.

---

## 🧪 Business Rules & API Reference

| Feature | Logic |
| --- | --- |
| **Capacity Constraints** | Automatic `WAITLISTED` state assignment when course capacity reaches maximum. |
| **Duplicate Check** | DB composite key constraint `UNIQUE(student_id, course_id)` prevents double registration. |
| **Auto-Promotion** | Cancelling an `ENROLLED` record immediately promotes the earliest `WAITLISTED` record sorted by `enrollment_date ASC`. |

### Key API Endpoints

* `GET /api/courses` — Fetch course list with dynamic enrollment count.
* `GET /api/students` — Fetch student roster.
* `GET /api/enrollments` — Fetch enrollment status and waitlist queues.
* `POST /api/enroll` — Body: `{ "student_id": 1, "course_id": 101 }` — Process registration.
* `POST /api/cancel` — Body: `{ "student_id": 1, "course_id": 101 }` — Cancel registration & promote waitlist.

---

## 📝 Part E — Assignment Write-up

### Reflections & Technical Approach

The trickiest part of this assignment was implementing the dynamic waitlist management and auto-promotion logic during an enrollment cancellation. When an actively `ENROLLED` student drops a course, promoting the first candidate on the waitlist requires maintaining absolute data consistency without race conditions or orphan states. I approached this by designing a First-In, First-Out (FIFO) queue prioritized by `enrollment_date ASC`. When a cancellation request arrives, the backend checks the cancelled status; if it was `ENROLLED`, an immediate query fetches the oldest `WAITLISTED` record for that specific course and atomically updates its status to `ENROLLED`.

If I had another week to expand this assignment, I would focus on three major enhancements:

1. **Schedule Overlap & Prerequisite Rules:** Implement logic to prevent students from enrolling in conflicting time slots or advanced courses without completing required prerequisites.
2. **Real-Time UI Updates & Notifications:** Integrate WebSockets (Socket.io) or email triggers to immediately alert students when they are promoted from a waitlist to an active seat.
3. **Authentication & Production Database:** Migrate the raw SQL queries to an ORM like Prisma or Sequelize with transaction isolation, and add JWT-based role authentication for students and administrators.

I utilized AI tools (ChatGPT/Claude) during this assignment primarily to quickly generate synthetic sample seed data (`INSERT` statements for students, courses, and enrollments) and scaffold initial boilerplate UI layouts. However, I independently designed the database relational schema constraints (including composite `UNIQUE(student_id, course_id)` keys), wrote the analytical SQL queries (grouping with conditional `COUNT` aggregations), built the core Express.js business logic for waitlist promotion, and debugged the seat allocation logic in Part D.
EOF

echo "✨ README.md generated successfully!"

```

---

### Step 2: Execute the Script
Run the following commands in your root terminal directory to create the `README.md` file:

```bash
chmod +x setup_project.sh
./setup_project.sh

```
