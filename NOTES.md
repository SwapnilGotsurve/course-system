### 1.	What was the trickiest part of this assignment for you, and how did you approach it? 

The trickiest part of this assignment was implementing the dynamic waitlist management and auto-promotion logic during an enrollment cancellation. When an actively ENROLLED student drops a course, promoting the first candidate on the waitlist requires maintaining absolute data consistency without race conditions or orphan states. I approached this by designing a First-In, First-Out (FIFO) queue prioritized by enrollment_date ASC. When a cancellation request arrives, the backend checks the cancelled status; if it was ENROLLED, an immediate query fetches the oldest WAITLISTED record for that specific course and atomically updates its status to ENROLLED.



### 2.	If you had another week, what would you improve or add?
 
If I had another week to expand this assignment, I would focus on three major enhancements:
-	Schedule Overlap & Prerequisite Rules: Implement logic to prevent students from enrolling in conflicting time slots or advanced courses without completing required prerequisites.
-	Real-Time UI Updates & Notifications: Integrate WebSockets (Socket.io) or email triggers to immediately alert students when they are promoted from a waitlist to an active seat.
-	Authentication & Production Database: Migrate the raw SQL queries to an ORM like Prisma or Sequelize with transaction isolation, and add JWT-based role authentication for students and administrators.



### 3. Did you use any AI tools (ChatGPT, Copilot, Claude, etc.) during this assignment?
 
I utilized AI tools (ChatGPT/Claude) during this assignment primarily to quickly generate synthetic sample seed data (INSERT statements for students, courses, and enrollments) and scaffold initial boilerplate UI layouts. However, I independently designed the database relational schema constraints (including composite UNIQUE(student_id, course_id) keys), wrote the analytical SQL queries (grouping with conditional COUNT aggregations), built the core Express.js business logic for waitlist promotion, and debugged the seat allocation logic in Part D.
