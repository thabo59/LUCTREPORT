export const ASSIGNMENT_INFO = {
  department: "Faculty of Information Communication Technology",
  courseName: "Bsc Degree in Software Engineering with Multimedia",
  semester: "2",
  projectTitle: "LRS Lesotho",
  subtitle: "Mobile Lecture Reporting Application for LUCT",
};

export const LIMKOKWING_LESOTHO_FACULTIES = [
  "Faculty of Information Communication Technology",
  "Faculty of Business and Global Management",
  "Faculty of Design and Innovation",
  "Faculty of Architecture and the Built Environment",
  "Faculty of Communication, Media and Broadcasting",
];

export const ROLE_MODULES = {
  student: ["Overview", "Monitoring", "Rating", "Attendance"],
  lecturer: ["Overview", "Classes", "Reports", "Monitoring", "Rating", "Student Attendance"],
  prl: ["Overview", "Courses", "Reports", "Monitoring", "Rating", "Classes"],
  pl: ["Overview", "Courses", "Reports", "Monitoring", "Classes", "Lectures", "Rating"],
};

export const REPORT_FIELDS = [
  ["facultyName", "Faculty Name"],
  ["className", "Class Name"],
  ["weekOfReporting", "Week of Reporting"],
  ["lectureDate", "Date of Lecture"],
  ["courseName", "Course Name"],
  ["courseCode", "Course Code"],
  ["lecturerName", "Lecturer's Name"],
  ["actualPresent", "Actual Number of Students Present"],
  ["totalRegistered", "Total Number of Registered Students"],
  ["venue", "Venue of the Class"],
  ["scheduledTime", "Scheduled Lecture Time"],
  ["topicTaught", "Topic Taught"],
  ["learningOutcomes", "Learning Outcomes of the Topic"],
  ["recommendations", "Lecturer's Recommendations"],
];

export const EMPTY_REPORT_FORM = REPORT_FIELDS.reduce((acc, [key]) => {
  acc[key] = "";
  return acc;
}, {});

export const LIMKOKWING_LESOTHO_COURSES = [
  { courseCode: "SEM201", courseName: "Software Engineering Principles" },
  { courseCode: "SEM202", courseName: "Object Oriented Programming" },
  { courseCode: "SEM203", courseName: "Database Systems" },
  { courseCode: "SEM204", courseName: "Web Application Development" },
  { courseCode: "SEM205", courseName: "Mobile Application Development" },
  { courseCode: "SEM206", courseName: "Human Computer Interaction" },
  { courseCode: "SEM207", courseName: "Computer Networks" },
  { courseCode: "SEM208", courseName: "Information Security" },
  { courseCode: "SEM209", courseName: "Multimedia Systems" },
  { courseCode: "SEM210", courseName: "Project Management for IT" },
  { courseCode: "SEM211", courseName: "Cloud Computing Fundamentals" },
  { courseCode: "SEM212", courseName: "Data Structures and Algorithms" },
];
