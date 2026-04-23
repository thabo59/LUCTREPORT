import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../AuthProvider';
import { Plus, Clock, CheckCircle2, AlertCircle, TrendingUp, Filter, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const LecturerDashboard = () => {
  const { profile } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!profile) return;
      try {
        const q = query(
          collection(db, 'lectures'),
          where('lecturerId', '==', profile.userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        setLectures(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching lectures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [profile]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Lecturer Home</h2>
          <p className="text-sm text-on-surface-variant">Manage your reports and sessions</p>
        </div>
        <Link 
          to="/lecture/new"
          className="bg-success text-on-success px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-success/90 transition-all active:scale-95"
        >
          <Plus size={16} /> New Report
        </Link>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-4 border border-outline-variant flex flex-col justify-between rounded-lg">
          <CheckCircle2 className="text-success w-6 h-6" />
          <div className="mt-6">
            <p className="text-xl font-bold text-on-surface">{lectures.filter(l => l.status === 'completed').length}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Reports Done</p>
          </div>
        </div>
        <div className="bg-surface-container p-4 border border-outline-variant flex flex-col justify-between rounded-lg">
          <AlertCircle className="text-error w-6 h-6" />
          <div className="mt-6">
            <p className="text-xl font-bold text-on-surface">{lectures.filter(l => l.status === 'missed').length}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Missed Sessions</p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface">Recent Submissions</h3>
          <Filter size={18} className="text-on-surface-variant cursor-pointer" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-on-surface-variant">Loading activities...</div>
        ) : lectures.length === 0 ? (
          <div className="bg-surface-container border border-outline-variant border-dashed p-10 rounded-lg text-center">
            <FileText className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <p className="text-sm text-on-surface-variant italic">No reports submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lectures.map((lecture) => (
              <div 
                key={lecture.id}
                className="bg-surface-container border border-outline-variant p-4 rounded-lg flex justify-between items-center group active:bg-surface-container-high transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                      lecture.status === 'completed' ? "bg-success/20 text-success" : 
                      lecture.status === 'missed' ? "bg-error/20 text-error" : 
                      "bg-surface-bright text-on-surface-variant"
                    )}>
                      {lecture.status}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {format(new Date(lecture.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h4 className="font-bold text-on-surface tracking-tight">{lecture.courseCode || 'Unknown Course'}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-1">{lecture.topic}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface">{lecture.studentsPresent}/{lecture.totalRegistered}</p>
                  <p className="text-[9px] text-on-surface-variant uppercase">Attended</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-success" size={20} />
          <div>
            <p className="text-sm font-bold text-on-surface">Compliance Rate</p>
            <p className="text-xs text-on-surface-variant">92% of lectures reported</p>
          </div>
        </div>
        <ArrowRight className="text-on-surface-variant" size={16} />
      </section>
    </motion.div>
  );
};
