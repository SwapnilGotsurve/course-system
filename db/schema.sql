-- =================================================================
-- COURSE ENROLLMENT SYSTEM - DATABASE SCHEMA & QUERIES
-- =================================================================

-- 1. TABLE CREATION
-------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    year_of_study INT CHECK (year_of_study BETWEEN 1 AND 4)
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    instructor_name VARCHAR(100) NOT NULL
);

-- Enrollment status must be either ENROLLED or WAITLISTED
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ENROLLED', 'WAITLISTED')),
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
);


-- 2. SAMPLE DATA INSERTION (Seed Data)
-------------------------------------------------------------------
-- Insert 8 Students
INSERT INTO students (name, email, year_of_study) VALUES
('Alice Smith', 'alice@college.edu', 2),
('Bob Jones', 'bob@college.edu', 1),
('Charlie Brown', 'charlie@college.edu', 3),
('Diana Prince', 'diana@college.edu', 4),
('Evan Wright', 'evan@college.edu', 2),
('Fiona Gallagher', 'fiona@college.edu', 1),
('George Clark', 'george@college.edu', 3),
('Hannah Abbott', 'hannah@college.edu', 4);

-- Insert 4 Courses
INSERT INTO courses (name, capacity, instructor_name) VALUES
('CS101: Intro to CS', 3, 'Dr. Alan Turing'),
('CS202: Data Structures', 4, 'Prof. Ada Lovelace'),
('CS303: Databases', 5, 'Dr. Edgar Codd'),
('CS404: Web Development', 2, 'Prof. Tim Berners-Lee');

-- Insert 15 Enrollment Records (Includes enrolled and waitlisted entries)
INSERT INTO enrollments (student_id, course_id, status) VALUES
(1, 1, 'ENROLLED'), (2, 1, 'ENROLLED'), (3, 1, 'ENROLLED'), -- CS101 Full (3/3)
(4, 1, 'WAITLISTED'), (5, 1, 'WAITLISTED'),               -- CS101 Waitlisted
(1, 2, 'ENROLLED'), (2, 2, 'ENROLLED'), (3, 2, 'ENROLLED'), -- CS202 (3/4)
(1, 3, 'ENROLLED'), (2, 3, 'ENROLLED'), (4, 3, 'ENROLLED'), -- CS303 (3/5)
(5, 4, 'ENROLLED'), (6, 4, 'ENROLLED'),                     -- CS404 Full (2/2)
(7, 4, 'WAITLISTED'), (1, 4, 'WAITLISTED');                 -- CS404 Waitlisted


-- 3. ANALYTICAL QUERIES (Part A Tasks)
-------------------------------------------------------------------
-- Query 1: Courses at full capacity
SELECT c.id, c.name, c.capacity, COUNT(e.id) AS enrolled_students
FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.status = 'ENROLLED'
GROUP BY c.id, c.name, c.capacity
HAVING COUNT(e.id) = c.capacity;

-- Query 2: Students enrolled in more than 2 courses
SELECT s.id, s.name, COUNT(e.id) AS enrolled_course_count
FROM students s
JOIN enrollments e ON s.id = e.student_id
WHERE e.status = 'ENROLLED'
GROUP BY s.id, s.name
HAVING COUNT(e.id) > 2;

-- Query 3: Enrolled count and remaining empty seats per course
SELECT 
    c.id, 
    c.name, 
    c.capacity,
    COUNT(CASE WHEN e.status = 'ENROLLED' THEN 1 END) AS enrolled_count,
    c.capacity - COUNT(CASE WHEN e.status = 'ENROLLED' THEN 1 END) AS empty_seats_remaining
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.name, c.capacity;

-- Query 4: Students not enrolled in any course
SELECT s.id, s.name, s.email
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
WHERE e.id IS NULL;