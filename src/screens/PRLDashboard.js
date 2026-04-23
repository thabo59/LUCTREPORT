import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../AuthProvider';
import { Filter, School, MessageSquare, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const PRLDashboard = () => {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(collection(db, 'lectures'), orderBy('createdAt', 'desc'), limit(15));
        const querySnapshot = await getDocs(q);
        setReports(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-on-surface">Review Dashboard</h2>
        <p className="text-sm text-on-surface-variant">Principal Lecturer Overview</p>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg col-span-2">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Weekly Attendance Trend</span>
            <span className="text-secondary font-bold">+12%</span>
          </div>
          <div className="h-16 w-full flex items-end gap-1.5 px-1">
            {[40, 60, 100, 50, 90, 45, 80].map((h, i) => (
              <div key={i} className={cn("w-full rounded-t-sm transition-all duration-500", i % 2 === 0 ? "bg-surface-bright" : "bg-success")} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Pending Reviews</span>
          <span className="text-3xl font-bold text-on-surface">24</span>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Missed Lectures</span>
          <span className="text-3xl font-bold text-error">03</span>
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface">Recent Submissions</h3>
          <Filter size={18} className="text-on-surface-variant" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-on-surface-variant">Scanning reports...</div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-surface-container border border-outline-variant p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-container-high p-2 rounded-lg">
                      {report.status === 'missed' ? <AlertTriangle className="text-error w-5 h-5" /> : <School className="text-success w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface tracking-tight">{report.courseCode || 'CS 201'}: {report.topic?.split(' ')[0] || 'Data'}</h4>
                      <p className="text-[11px] text-on-surface-variant">{report.lecturerId?.slice(0, 5)} • {report.scheduledTime || '08:00 AM'}</p>
                    </div>
                  </div>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter", report.status === 'completed' ? "bg-success/20 text-success" : report.status === 'missed' ? "bg-error/20 text-error" : "bg-surface-bright text-on-surface-variant")}>
                    {report.status}
                  </span>
                </div>
                {report.status !== 'scheduled' && (
                  <div className="flex items-center gap-4 pt-3 border-t border-outline-variant">
                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface py-2 hover:bg-surface-container-high rounded transition-colors">
                      <ClipboardCheck size={14} /> Review
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-success py-2 hover:bg-surface-container-high rounded transition-colors">
                      <MessageSquare size={14} /> Feedback
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};
