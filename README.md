# College Course Enrollment System

A full-stack **Course Enrollment System** built with **React (Vite)**, **Express.js (Node.js)**, and **MySQL**. The application manages student course registrations, enforces course capacity limits, prevents duplicate enrollments, and automatically promotes students from the waitlist using a **First-In, First-Out (FIFO)** strategy when seats become available.

---

#  Project Architecture

```text
course-system/
├── db/
│   └── schema.sql          # MySQL database setup, tables, constraints & seed data
├── backend/
│   ├── server.js           # Express.js API with waitlist auto-promotion logic
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx         # React dashboard UI
    │   └── main.jsx
    └── package.json
```

---

#  Prerequisites

Ensure the following software is installed:

- Node.js (v18 or later)
- npm
- MySQL Server (v8.0 or later)
- Git Bash or any terminal

**Database Credentials**

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 3306 |
| Username | root |
| Password | root |

```
http://localhost:5000
```

---

## Step 3: Frontend Setup

Open another terminal.

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the Vite development server.

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

# backend setup
1. Go to backend folder.
2. run npm install
3. npm start 
4. http://localhost:5000

# Core Features

| Feature | Description |
|---------|-------------|
| Student Registration | Register students for available courses |
| Course Capacity | Prevents enrollment beyond the maximum capacity |
| Duplicate Prevention | A student cannot enroll in the same course twice |
| Automatic Waitlist | Students are automatically waitlisted when a course is full |
| FIFO Promotion | The first student on the waitlist is promoted when a seat becomes available |
| Enrollment Status | Displays ENROLLED and WAITLISTED statuses |
| Dashboard | View students, courses, and enrollment information |

---

# REST API Endpoints

## Get All Courses

```http
GET /api/courses
```

Returns all courses along with enrolled and waitlisted counts.

---

## Get All Students

```http
GET /api/students
```

Returns the list of students.

---

## Get All Enrollments

```http
GET /api/enrollments
```

Returns all active enrollments and waitlisted students.

---

## Enroll a Student

```http
POST /api/enroll
```

Request Body

```json
{
  "student_id": 1,
  "course_id": 101
}
```

Response

- Student enrolled successfully
- Student waitlisted (if course is full)
- Duplicate enrollment prevented

---

## Cancel Enrollment

```http
POST /api/cancel
```

Request Body

```json
{
  "student_id": 1,
  "course_id": 101
}
```

If the cancelled student was **ENROLLED**, the earliest **WAITLISTED** student is automatically promoted.

---

# Database Design

Main Tables

- Students
- Courses
- Enrollments

Important Constraint

```sql
UNIQUE(student_id, course_id)
```

This ensures that the same student cannot enroll in the same course more than once.

---

# Business Rules

### Capacity Constraint

- Students are enrolled until capacity is reached.
- Additional students are automatically waitlisted.

### Duplicate Prevention

- Duplicate registrations are blocked using a composite unique constraint.

### Waitlist Promotion

When an enrolled student cancels:

1. Remove the enrolled record.
2. Find the oldest waitlisted student.
3. Update their status to **ENROLLED**.
4. Maintain FIFO order using `enrollment_date`.

---

# Technology Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Libraries

- express
- mysql2
- cors
