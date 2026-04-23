import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../AuthProvider';
import { CheckCircle, AlertCircle, TrendingUp, Verified, Star, Clock, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const q = query(collection(db, 'lectures'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        setLectures(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching lectures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleAttendance = async (lectureId) => {
    if (!profile) return;
    try {
      await addDoc(collection(db, 'interactions'), {
        lectureId,
        userId: profile.userId,
        type: 'attendance_mark',
        timestamp: serverTimestamp(),
      });
      alert('Attendance marked successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <section className="space-y-1">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Academic Year 2023/24</span>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-on-surface">{profile?.displayName}</h2>
          <div className="text-right">
            <span className="text-lg font-bold text-secondary">88%</span>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Overall Attendance</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-4 border border-outline-variant flex flex-col justify-between rounded-lg">
          <CheckCircle className="text-secondary w-6 h-6" />
          <div className="mt-8">
            <p className="text-xl font-bold text-on-surface">42</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Classes Attended</p>
          </div>
        </div>
        <div className="bg-surface-container p-4 border border-outline-variant flex flex-col justify-between rounded-lg">
          <AlertCircle className="text-error w-6 h-6" />
          <div className="mt-8">
            <p className="text-xl font-bold text-on-surface">04</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Missed Lectures</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface">Current Lectures</h3>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase cursor-pointer hover:text-on-surface transition-colors">View Schedule</span>
        </div>

        {lectures.map((lecture, idx) => (
          <div key={lecture.id} className="bg-surface-container border border-outline-variant p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                  idx === 0 ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-surface-bright text-on-surface-variant"
                )}>
                  {idx === 0 ? 'IN PROGRESS' : 'COMPLETED'}
                </span>
                <h4 className="text-lg font-bold text-on-surface mt-1">{lecture.courseCode || 'CS401'}: {lecture.topic?.split(' ')[0] || 'Engineering'}</h4>
                <p className="text-xs text-on-surface-variant">Dr. Lerotholi | Room 102</p>
              </div>
              {idx > 0 && <Verified className="text-secondary w-5 h-5" />}
            </div>

            {idx === 0 ? (
              <button onClick={() => handleAttendance(lecture.id)} className="w-full bg-secondary text-on-secondary font-bold h-12 flex items-center justify-center gap-2 rounded-lg transition-all active:scale-95 shadow-lg">
                <UserCheck className="w-5 h-5" />
                MARK ATTENDANCE
              </button>
            ) : (
              <div className="pt-2 border-t border-outline-variant flex justify-between items-center">
                <p className="text-xs text-on-surface-variant italic">How was the lecture?</p>
                <button className="text-secondary text-xs font-bold flex items-center gap-1.5 py-2 px-3 hover:bg-surface-container-high rounded transition-all active:scale-95">
                  <Star className="w-4 h-4" />
                  RATE LECTURER
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4 pb-8">
        <h3 className="text-lg font-bold text-on-surface">Course Summary</h3>
        <div className="space-y-2">
          {['CS401', 'MA205'].map((code, idx) => (
            <div key={code} className="bg-surface-container-low p-4 border border-outline-variant flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center rounded">
                  <span className="text-on-surface font-bold text-xs">{code.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{code}</p>
                  <p className="text-[10px] text-on-surface-variant">{92 - idx * 8}% Attendance</p>
                </div>
              </div>
              <TrendingUp className={idx === 0 ? "text-secondary" : "text-on-surface-variant opacity-30"} size={18} />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
