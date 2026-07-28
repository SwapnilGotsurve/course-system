import { useEffect, useState } from 'react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState(null);

  // Fetch all system state from API
  const fetchData = async () => {
    try {
      const [cRes, sRes, eRes] = await Promise.all([
        fetch('http://localhost:5000/api/courses'),
        fetch('http://localhost:5000/api/students'),
        fetch('http://localhost:5000/api/enrollments')
      ]);

      const cData = await cRes.json();
      const sData = await sRes.json();
      const eData = await eRes.json();

      setCourses(cData);
      setStudents(sData);
      setEnrollments(eData);

      if (sData.length > 0 && !selectedStudent) setSelectedStudent(sData[0].id);
      if (cData.length > 0 && !selectedCourse) setSelectedCourse(cData[0].id);
    } catch (err) {
      console.error('Failed to fetch API data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch('http://localhost:5000/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: selectedStudent, course_id: selectedCourse })
      });

      const data = await res.json();
      setMessage({
        text: data.message,
        isError: !res.ok,
        isWaitlisted: data.status === 'WAITLISTED'
      });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to connect to backend server.', isError: true });
    }
  };

  const handleCancel = async (studentId, courseId) => {
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId })
      });

      const data = await res.json();
      setMessage({ text: data.message, isError: !res.ok, isWaitlisted: false });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to execute cancellation.', isError: true });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">College Course Enrollment System</h1>
        <p className="text-slate-600">Real-time enrollment, full capacity checks, and automatic waitlist processing.</p>
      </header>

      {/* Action Notification Banner */}
      {message && (
        <div
          className={`p-4 mb-6 rounded-lg font-medium text-sm border ${
            message.isWaitlisted
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : message.isError
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Enrollment Action Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">Enroll Student</h2>
        <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Year {s.year_of_study})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Cap: {c.capacity})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Submit Enrollment
          </button>
        </form>
      </div>

      {/* Courses Overview Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700">Course Offerings</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="p-4">Course Name</th>
              <th className="p-4">Instructor</th>
              <th className="p-4 text-center">Capacity</th>
              <th className="p-4 text-center">Enrolled</th>
              <th className="p-4 text-center">Waitlist</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {courses.map((course) => {
              const isFull = course.enrolled >= course.capacity;
              return (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{course.name}</td>
                  <td className="p-4 text-slate-600">{course.instructor_name}</td>
                  <td className="p-4 text-center text-slate-600">{course.capacity}</td>
                  <td className="p-4 text-center font-semibold text-slate-700">{course.enrolled}</td>
                  <td className="p-4 text-center text-amber-600 font-medium">{course.waitlisted}</td>
                  <td className="p-4 text-center">
                    {isFull ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800">
                        Course Full — Added to Waitlist
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                        {course.capacity - course.enrolled} Seats Open
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Active Registrations and Waitlists Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700">Active Registrations & Waitlists</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No active enrollments.
                </td>
              </tr>
            ) : (
              enrollments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{item.student_name}</td>
                  <td className="p-4 text-slate-600">{item.course_name}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        item.status === 'ENROLLED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCancel(item.student_id, item.course_id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium px-3 py-1 rounded text-xs transition-colors border border-rose-200"
                    >
                      Cancel Registration
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}