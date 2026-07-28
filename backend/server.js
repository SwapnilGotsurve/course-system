import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Data Store (Mirrors SQL DB Structure)
let students = [
  { id: 1, name: 'Alice Smith', email: 'alice@college.edu', year_of_study: 2 },
  { id: 2, name: 'Bob Jones', email: 'bob@college.edu', year_of_study: 1 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@college.edu', year_of_study: 3 },
  { id: 4, name: 'Diana Prince', email: 'diana@college.edu', year_of_study: 4 },
  { id: 5, name: 'Evan Wright', email: 'evan@college.edu', year_of_study: 2 },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@college.edu', year_of_study: 1 },
  { id: 7, name: 'George Clark', email: 'george@college.edu', year_of_study: 3 },
  { id: 8, name: 'Hannah Abbott', email: 'hannah@college.edu', year_of_study: 4 }
];

let courses = [
  { id: 101, name: 'CS101: Intro to CS', capacity: 2, instructor_name: 'Dr. Alan Turing' },
  { id: 102, name: 'CS202: Data Structures', capacity: 3, instructor_name: 'Prof. Ada Lovelace' },
  { id: 103, name: 'CS303: Databases', capacity: 4, instructor_name: 'Dr. Edgar Codd' }
];

let enrollments = [
  { id: 1, student_id: 1, course_id: 101, status: 'ENROLLED', enrollment_date: new Date('2026-01-10T09:00:00') },
  { id: 2, student_id: 2, course_id: 101, status: 'ENROLLED', enrollment_date: new Date('2026-01-10T10:00:00') }
];

// ==========================================
// CORE LOGIC FUNCTIONS (Part B)
// ==========================================

/**
 * Enrolls a student or adds them to a waitlist if capacity is full.
 */
function enrollStudent(studentId, courseId) {
  const student = students.find(s => s.id === Number(studentId));
  const course = courses.find(c => c.id === Number(courseId));

  if (!student || !course) {
    return { success: false, message: 'Error: Invalid Student or Course ID.' };
  }

  // Check duplicate enrollment
  const existing = enrollments.find(e => e.student_id === student.id && e.course_id === course.id);
  if (existing) {
    const msg = `[ALREADY ENROLLED] ${student.name} is already registered (${existing.status}) for ${course.name}.`;
    console.log(msg);
    return { success: false, message: msg };
  }

  // Count active ENROLLED students
  const currentEnrolled = enrollments.filter(e => e.course_id === course.id && e.status === 'ENROLLED').length;

  if (currentEnrolled < course.capacity) {
    // Normal Enrollment
    const record = {
      id: enrollments.length + 1,
      student_id: student.id,
      course_id: course.id,
      status: 'ENROLLED',
      enrollment_date: new Date()
    };
    enrollments.push(record);
    const msg = `[ENROLLED] ${student.name} successfully enrolled in ${course.name}.`;
    console.log(msg);
    return { success: true, message: msg, status: 'ENROLLED' };
  } else {
    // Waitlist Addition
    const record = {
      id: enrollments.length + 1,
      student_id: student.id,
      course_id: course.id,
      status: 'WAITLISTED',
      enrollment_date: new Date()
    };
    enrollments.push(record);
    const msg = `[WAITLISTED] Course full — ${student.name} added to waitlist for ${course.name}.`;
    console.log(msg);
    return { success: true, message: msg, status: 'WAITLISTED' };
  }
}

/**
 * Cancels enrollment and auto-promotes the next waitlisted student.
 */
function cancelEnrollment(studentId, courseId) {
  const index = enrollments.findIndex(e => e.student_id === Number(studentId) && e.course_id === Number(courseId));
  if (index === -1) {
    return { success: false, message: 'Error: Enrollment record not found.' };
  }

  const removed = enrollments.splice(index, 1)[0];
  const student = students.find(s => s.id === Number(studentId));
  const course = courses.find(c => c.id === Number(courseId));

  let msg = `[CANCELLED] Cancelled enrollment for ${student ? student.name : 'Student'} in ${course ? course.name : 'Course'}.`;

  // If the cancelled student was actively ENROLLED, promote the first WAITLISTED student (FIFO)
  if (removed.status === 'ENROLLED') {
    const waitlisted = enrollments
      .filter(e => e.course_id === Number(courseId) && e.status === 'WAITLISTED')
      .sort((a, b) => new Date(a.enrollment_date) - new Date(b.enrollment_date));

    if (waitlisted.length > 0) {
      const nextInWaitlist = waitlisted[0];
      nextInWaitlist.status = 'ENROLLED';
      const promotedStudent = students.find(s => s.id === nextInWaitlist.student_id);
      msg += ` [PROMOTED] ${promotedStudent ? promotedStudent.name : 'Student'} was automatically promoted from waitlist to ENROLLED.`;
    }
  }

  console.log(msg);
  return { success: true, message: msg };
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

app.get('/api/courses', (req, res) => {
  const summary = courses.map(c => {
    const enrolled = enrollments.filter(e => e.course_id === c.id && e.status === 'ENROLLED').length;
    const waitlisted = enrollments.filter(e => e.course_id === c.id && e.status === 'WAITLISTED').length;
    return { ...c, enrolled, waitlisted };
  });
  res.json(summary);
});

app.get('/api/students', (req, res) => res.json(students));

app.get('/api/enrollments', (req, res) => {
  const detailed = enrollments.map(e => {
    const student = students.find(s => s.id === e.student_id);
    const course = courses.find(c => c.id === e.course_id);
    return {
      ...e,
      student_name: student ? student.name : 'Unknown',
      course_name: course ? course.name : 'Unknown'
    };
  });
  res.json(detailed);
});

app.post('/api/enroll', (req, res) => {
  const { student_id, course_id } = req.body;
  const result = enrollStudent(student_id, course_id);
  res.status(result.success ? 200 : 400).json(result);
});

app.post('/api/cancel', (req, res) => {
  const { student_id, course_id } = req.body;
  const result = cancelEnrollment(student_id, course_id);
  res.json(result);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));