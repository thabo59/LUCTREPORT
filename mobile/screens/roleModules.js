import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import LecturerReportForm from "../components/LecturerReportForm";
import { Card, InfoRow, PrimaryButton, RowItem, SecondaryButton, AppInput } from "../components/ui";
import { ASSIGNMENT_INFO, LIMKOKWING_LESOTHO_COURSES } from "../constants/assignment";
import {
  listCollection,
  markAttendance,
  saveCourse,
  savePRLFeedback,
  saveRating,
  scoreAverage,
} from "../services/dataService";

function useCollection(name, deps = []) {
  const [items, setItems] = useState([]);
  const reload = async () => setItems(await listCollection(name));
  useEffect(() => {
    reload();
  }, deps);
  return { items, reload };
}

function Overview({ role }) {
  return (
    <Card title="Overview">
      <InfoRow label="Department" value={ASSIGNMENT_INFO.department} />
      <InfoRow label="Course" value={ASSIGNMENT_INFO.courseName} />
      <InfoRow label="Semester" value={ASSIGNMENT_INFO.semester} />
      <InfoRow label="Current Role" value={String(role).toUpperCase()} />
      <Text style={{ color: "#9fa4a5", fontSize: 12 }}>
        This app is structured for LUCT reporting workflows across Student, Lecturer, PRL, and PL modules.
      </Text>
    </Card>
  );
}

function StudentMonitoring({ userId }) {
  const attendance = useCollection("attendance", [userId]);
  const ratings = useCollection("ratings", [userId]);

  const mineAttend = attendance.items.filter((x) => x.studentId === userId);
  const myRatings = ratings.items.filter((x) => x.raterId === userId);

  return (
    <Card title="Student Monitoring">
      <InfoRow label="Attendance Marked" value={`${mineAttend.filter((x) => x.status === "present").length}/${mineAttend.length}`} />
      <InfoRow label="Average Submitted Rating" value={scoreAverage(myRatings)} />
    </Card>
  );
}

function StudentAttendance({ userId }) {
  const reports = useCollection("lectureReports");

  const onMark = async (report) => {
    await markAttendance({ report, studentId: userId });
    Alert.alert("Attendance", "Attendance marked successfully.");
  };

  return (
    <Card title="Student Attendance">
      {reports.items.slice(0, 20).map((report) => (
        <RowItem
          key={report.id}
          title={`${report.courseCode} - ${report.topicTaught}`}
          subtitle={`${report.lectureDate} | ${report.scheduledTime} | ${report.venue}`}
        >
          <SecondaryButton label="Mark Present" onPress={() => onMark(report)} />
        </RowItem>
      ))}
      {!reports.items.length ? <Text style={{ color: "#9fa4a5", fontSize: 12 }}>No lecture reports found yet.</Text> : null}
    </Card>
  );
}

function StudentRating({ userId }) {
  const reports = useCollection("lectureReports");
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const onSubmit = async () => {
    if (!selected) return;
    await saveRating({
      lectureReportId: selected.id,
      courseCode: selected.courseCode,
      targetLecturerName: selected.lecturerName,
      targetLecturerId: selected.reportedBy || "",
      raterId: userId,
      rating,
      comment,
    });
    setComment("");
    Alert.alert("Rating", "Rating submitted.");
  };

  return (
    <Card title="Student Rating">
      <Text style={{ color: "#c4c7c7", fontSize: 12, fontWeight: "600" }}>Select Lecture</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {reports.items.slice(0, 20).map((report) => {
          const active = selected?.id === report.id;
          return (
            <Text
              key={report.id}
              onPress={() => setSelected(report)}
              style={{
                borderWidth: 1,
                borderColor: active ? "#78dc77" : "#444748",
                backgroundColor: active ? "#78dc77" : "#1b1b1b",
                color: active ? "#00390a" : "#c4c7c7",
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {report.courseCode}
            </Text>
          );
        })}
      </ScrollView>
      <Text style={{ color: "#c4c7c7", fontSize: 12, fontWeight: "600" }}>Rating (1-5)</Text>
      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Text
            key={num}
            onPress={() => setRating(num)}
            style={{
              borderWidth: 1,
              borderColor: rating === num ? "#78dc77" : "#444748",
              backgroundColor: rating === num ? "#78dc77" : "#131313",
              color: rating === num ? "#00390a" : "#c4c7c7",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            {num}
          </Text>
        ))}
      </View>
      <AppInput label="Comment" multiline value={comment} onChangeText={setComment} placeholder="Share your feedback" />
      <PrimaryButton label="Submit Rating" onPress={onSubmit} />
    </Card>
  );
}

function LecturerClasses({ userId, profile }) {
  const classes = useCollection("classProfiles", [userId]);
  const mine = classes.items.filter(
    (x) =>
      x.updatedBy === userId ||
      x.assignedLecturerId === userId ||
      (profile?.name && x.assignedLecturerName === profile.name)
  );
  return (
    <Card title="Lecturer Classes">
      {mine.map((item) => (
        <RowItem key={item.profileId} title={`${item.courseCode} - ${item.courseName}`} subtitle={`${item.facultyName} | ${item.className}`}>
          <Text style={{ color: "#c4c7c7", fontSize: 11 }}>Registered: {item.totalRegistered}</Text>
          <Text style={{ color: "#c4c7c7", fontSize: 11 }}>Room/Hall: {item.venue || "Not set"} | Time: {item.scheduledTime || "Not set"}</Text>
        </RowItem>
      ))}
      {!mine.length ? <Text style={{ color: "#9fa4a5", fontSize: 12 }}>No classes added yet.</Text> : null}
    </Card>
  );
}

function LecturerReports({ userId, profile }) {
  const reports = useCollection("lectureReports", [userId]);
  const mine = reports.items.filter((x) => x.reportedBy === userId).slice(0, 20);

  return (
    <View style={{ gap: 10 }}>
      <LecturerReportForm userId={userId} lecturerName={profile?.name || ""} onSubmitted={reports.reload} />
      <Card title="Recent Lecturer Reports">
        {mine.map((report) => (
          <RowItem key={report.id} title={`${report.courseCode} | Week ${report.weekOfReporting}`} subtitle={`${report.className} | ${report.lectureDate}`}>
            <Text style={{ color: "#c4c7c7", fontSize: 11 }}>
              Present: {report.actualPresent}/{report.totalRegistered}
            </Text>
          </RowItem>
        ))}
      </Card>
    </View>
  );
}

function LecturerMonitoring({ userId }) {
  const reports = useCollection("lectureReports", [userId]);
  const mine = reports.items.filter((x) => x.reportedBy === userId);
  const avg = mine.length
    ? (
        mine.reduce(
          (sum, item) => sum + (Number(item.actualPresent) / Math.max(Number(item.totalRegistered), 1)) * 100,
          0
        ) / mine.length
      ).toFixed(1)
    : "0";
  return (
    <Card title="Lecturer Monitoring">
      <InfoRow label="Reports Submitted" value={String(mine.length)} />
      <InfoRow label="Average Attendance" value={`${avg}%`} />
    </Card>
  );
}

function LecturerRating({ userId }) {
  const ratings = useCollection("ratings", [userId]);
  const mine = ratings.items.filter((x) => x.targetLecturerId === userId);
  return (
    <Card title="Lecturer Rating">
      <InfoRow label="Average Rating" value={scoreAverage(mine)} />
      {mine.map((item) => (
        <RowItem key={item.id} title={`${item.courseCode} - ${item.rating}/5`} subtitle={item.comment || "No comment"} />
      ))}
    </Card>
  );
}

function LecturerStudentAttendance({ userId }) {
  const reports = useCollection("lectureReports", [userId]);
  const attendance = useCollection("attendance", [userId]);
  const mine = reports.items.filter((x) => x.reportedBy === userId);
  return (
    <Card title="Student Attendance (Lecturer)">
      {mine.map((report) => {
        const count = attendance.items.filter((x) => x.lectureReportId === report.id && x.status === "present").length;
        return <RowItem key={report.id} title={`${report.courseCode} - ${report.topicTaught}`} subtitle={`Marked Present: ${count} students`} />;
      })}
    </Card>
  );
}

function PRLCourses() {
  const courses = useCollection("courses");
  return (
    <Card title="PRL Courses (View all courses & lectures under stream)">
      {courses.items.map((c) => (
        <RowItem
          key={c.id}
          title={`${c.courseCode} - ${c.courseName}`}
          subtitle={`Class: ${c.className || "N/A"} | Room/Hall: ${c.venue || "N/A"} | Time: ${c.scheduledTime || "N/A"}`}
        />
      ))}
    </Card>
  );
}

function PRLReports({ userId }) {
  const reports = useCollection("lectureReports");
  const [feedback, setFeedback] = useState({});

  const submit = async (reportId) => {
    if (!feedback[reportId]) return;
    await savePRLFeedback(reportId, feedback[reportId], userId);
    Alert.alert("Feedback", "PRL feedback added.");
  };

  return (
    <Card title="PRL Reports (View lecture reports & add feedback)">
      {reports.items.slice(0, 40).map((report) => (
        <RowItem key={report.id} title={`${report.courseCode} | ${report.className}`} subtitle={`Topic: ${report.topicTaught}`}>
          <AppInput
            value={feedback[report.id] || ""}
            onChangeText={(text) => setFeedback((prev) => ({ ...prev, [report.id]: text }))}
            placeholder="Add PRL feedback"
          />
          <SecondaryButton label="Submit Feedback" onPress={() => submit(report.id)} />
        </RowItem>
      ))}
    </Card>
  );
}

function PRLMonitoring() {
  const reports = useCollection("lectureReports");
  const classes = new Set(reports.items.map((x) => x.className).filter(Boolean));
  return (
    <Card title="PRL Monitoring">
      <InfoRow label="Total Lecture Reports" value={String(reports.items.length)} />
      <InfoRow label="Distinct Classes" value={String(classes.size)} />
    </Card>
  );
}

function PRLRating() {
  const ratings = useCollection("ratings");
  return (
    <Card title="PRL Rating Overview">
      <InfoRow label="Overall Lecturer Rating" value={scoreAverage(ratings.items)} />
    </Card>
  );
}

function PRLClasses() {
  const classes = useCollection("classProfiles");
  return (
    <Card title="PRL Classes">
      {classes.items.map((item) => (
        <RowItem
          key={item.profileId}
          title={item.className}
          subtitle={`${item.courseCode} | ${item.facultyName} | Room/Hall: ${item.venue || "N/A"} | Time: ${item.scheduledTime || "N/A"}`}
        />
      ))}
    </Card>
  );
}

function PLCourses({ userId }) {
  const courses = useCollection("courses");
  const [form, setForm] = useState({
    facultyName: "",
    className: "",
    courseName: "",
    courseCode: "",
    stream: "",
    assignedLecturerName: "",
    assignedLecturerId: "",
    venue: "",
    scheduledTime: "",
    totalRegistered: "",
  });
  const selectedCourse = LIMKOKWING_LESOTHO_COURSES.find((c) => c.courseCode === form.courseCode) || null;

  const submit = async () => {
    if (!selectedCourse || !form.className || !form.venue || !form.scheduledTime) {
      Alert.alert("Course", "Please select a Limkokwing Lesotho course, class, room/hall, and time.");
      return;
    }
    await saveCourse(form, userId);
    setForm({
      facultyName: "",
      className: "",
      courseName: "",
      courseCode: "",
      stream: "",
      assignedLecturerName: "",
      assignedLecturerId: "",
      venue: "",
      scheduledTime: "",
      totalRegistered: "",
    });
    await courses.reload();
  };

  return (
    <Card title="PL Courses (Add / Assign lecture modules)">
      <Text style={{ color: "#78dc77", fontSize: 12, fontWeight: "600" }}>
        Course Catalog: Limkokwing University of Creative Technology Lesotho only
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {LIMKOKWING_LESOTHO_COURSES.map((course) => {
          const active = form.courseCode === course.courseCode;
          return (
            <Text
              key={course.courseCode}
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  courseCode: course.courseCode,
                  courseName: course.courseName,
                }))
              }
              style={{
                borderWidth: 1,
                borderColor: active ? "#78dc77" : "#444748",
                backgroundColor: active ? "#78dc77" : "#1b1b1b",
                color: active ? "#00390a" : "#c4c7c7",
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {course.courseCode}
            </Text>
          );
        })}
      </ScrollView>
      <Text style={{ color: "#c4c7c7", fontSize: 12 }}>
        Selected Course: {selectedCourse ? `${selectedCourse.courseCode} - ${selectedCourse.courseName}` : "None"}
      </Text>
      <AppInput value={form.facultyName} onChangeText={(v) => setForm((p) => ({ ...p, facultyName: v }))} placeholder="Faculty name" />
      <AppInput value={form.className} onChangeText={(v) => setForm((p) => ({ ...p, className: v }))} placeholder="Class name" />
      <AppInput value={form.stream} onChangeText={(v) => setForm((p) => ({ ...p, stream: v }))} placeholder="Stream" />
      <AppInput value={form.venue} onChangeText={(v) => setForm((p) => ({ ...p, venue: v }))} placeholder="Room/Hall" />
      <AppInput value={form.scheduledTime} onChangeText={(v) => setForm((p) => ({ ...p, scheduledTime: v }))} placeholder="Scheduled time" />
      <AppInput
        value={form.totalRegistered}
        onChangeText={(v) => setForm((p) => ({ ...p, totalRegistered: v }))}
        placeholder="Total registered students"
        keyboardType="numeric"
      />
      <AppInput
        value={form.assignedLecturerName}
        onChangeText={(v) => setForm((p) => ({ ...p, assignedLecturerName: v }))}
        placeholder="Assign lecturer (name)"
      />
      <AppInput
        value={form.assignedLecturerId}
        onChangeText={(v) => setForm((p) => ({ ...p, assignedLecturerId: v }))}
        placeholder="Assign lecturer UID (optional)"
      />
      <PrimaryButton label="Save Course" onPress={submit} />
      {courses.items.map((course) => (
        <RowItem
          key={course.id}
          title={`${course.courseCode} - ${course.courseName}`}
          subtitle={`Class: ${course.className || "N/A"} | Room/Hall: ${course.venue || "N/A"} | Time: ${course.scheduledTime || "N/A"} | Assigned: ${course.assignedLecturerName || "Unassigned"}`}
        />
      ))}
    </Card>
  );
}

function PLReports() {
  const reports = useCollection("lectureReports");
  const feedback = useCollection("prlFeedback");
  return (
    <Card title="PL Reports (View reports from PRL)">
      {reports.items.slice(0, 30).map((item) => {
        const fb = feedback.items.find((x) => x.reportId === item.id);
        return (
          <RowItem key={item.id} title={`${item.courseCode} | ${item.className}`} subtitle={`Lecture Topic: ${item.topicTaught}`}>
            <Text style={{ color: "#c4c7c7", fontSize: 11 }}>PRL Feedback: {fb?.feedback || "No feedback yet"}</Text>
          </RowItem>
        );
      })}
    </Card>
  );
}

function PLMonitoring() {
  const courses = useCollection("courses");
  const reports = useCollection("lectureReports");
  const ratings = useCollection("ratings");
  return (
    <Card title="PL Monitoring">
      <InfoRow label="Total Courses" value={String(courses.items.length)} />
      <InfoRow label="Total Lecture Reports" value={String(reports.items.length)} />
      <InfoRow label="Average Rating" value={scoreAverage(ratings.items)} />
    </Card>
  );
}

function PLClasses() {
  const classes = useCollection("classProfiles");
  return (
    <Card title="PL Classes">
      {classes.items.map((item) => (
        <RowItem
          key={item.profileId}
          title={item.className}
          subtitle={`${item.courseCode} | Registered: ${item.totalRegistered} | Room/Hall: ${item.venue || "N/A"} | Time: ${item.scheduledTime || "N/A"}`}
        />
      ))}
    </Card>
  );
}

function PLLectures() {
  const lectures = useCollection("lectureReports");
  return (
    <Card title="PL Lectures">
      {lectures.items.slice(0, 50).map((item) => (
        <RowItem key={item.id} title={`${item.courseCode} | ${item.lectureDate}`} subtitle={`${item.scheduledTime} | ${item.venue} | Week ${item.weekOfReporting}`} />
      ))}
    </Card>
  );
}

function PLRating() {
  const ratings = useCollection("ratings");
  return (
    <Card title="PL Rating">
      <InfoRow label="System Average Rating" value={scoreAverage(ratings.items)} />
      <Text style={{ color: "#9fa4a5", fontSize: 12 }}>Review global rating quality across lecturers and courses.</Text>
    </Card>
  );
}

export function renderRoleModule({ role, module, userId, profile }) {
  if (module === "Overview") return <Overview role={role} />;

  if (role === "student") {
    if (module === "Monitoring") return <StudentMonitoring userId={userId} />;
    if (module === "Rating") return <StudentRating userId={userId} />;
    return <StudentAttendance userId={userId} />;
  }

  if (role === "lecturer") {
    if (module === "Classes") return <LecturerClasses userId={userId} profile={profile} />;
    if (module === "Reports") return <LecturerReports userId={userId} profile={profile} />;
    if (module === "Monitoring") return <LecturerMonitoring userId={userId} />;
    if (module === "Rating") return <LecturerRating userId={userId} />;
    return <LecturerStudentAttendance userId={userId} />;
  }

  if (role === "prl") {
    if (module === "Courses") return <PRLCourses />;
    if (module === "Reports") return <PRLReports userId={userId} />;
    if (module === "Monitoring") return <PRLMonitoring />;
    if (module === "Rating") return <PRLRating />;
    return <PRLClasses />;
  }

  if (module === "Courses") return <PLCourses userId={userId} />;
  if (module === "Reports") return <PLReports />;
  if (module === "Monitoring") return <PLMonitoring />;
  if (module === "Classes") return <PLClasses />;
  if (module === "Lectures") return <PLLectures />;
  return <PLRating />;
}
