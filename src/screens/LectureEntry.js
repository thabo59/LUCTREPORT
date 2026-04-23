import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { School, Calendar, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const LectureEntry = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    faculty: profile?.faculty || 'Faculty of Information & Tech',
    class: 'BSc SE Year 3',
    courseCode: 'CS401',
    venue: '',
    scheduledTime: '',
    week: 8,
    date: new Date().toISOString().split('T')[0],
    studentsPresent: 0,
    totalRegistered: 40,
    topic: '',
    outcomes: '',
    recommendations: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'lectures'), {
        ...formData,
        lecturerId: profile.userId,
        status: 'completed',
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full h-12 bg-background border border-outline-variant rounded-lg px-4 text-on-surface text-sm focus:border-success focus:ring-1 focus:ring-success outline-none transition-all placeholder:text-surface-bright";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 ml-1";
  const sectionClasses = "bg-surface-container p-5 rounded-lg border border-outline-variant space-y-4";

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 pb-20"
    >
      <header>
        <h2 className="text-2xl font-bold text-on-surface">Lecture Entry</h2>
        <p className="text-sm text-on-surface-variant">Record lecture details for national compliance</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2">
            <School className="text-on-surface w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Course Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Faculty</label>
              <select 
                value={formData.faculty}
                onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                className={inputClasses}
              >
                <option>Faculty of Education</option>
                <option>Faculty of Humanities</option>
                <option>Faculty of Science & Tech</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Class</label>
                <input type="text" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Course Code</label>
                <input type="text" value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} className={inputClasses} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Venue</label>
                <input type="text" placeholder="e.g. Hall A1" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Time</label>
                <input type="time" value={formData.scheduledTime} onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})} className={inputClasses} />
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-on-surface w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Timing</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Reporting Week</label>
              <input type="number" value={formData.week} onChange={(e) => setFormData({...formData, week: parseInt(e.target.value)})} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Lecture Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={inputClasses} />
            </div>
          </div>
        </section>

        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-on-surface w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Attendance</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Present</label>
              <input type="number" value={formData.studentsPresent} onChange={(e) => setFormData({...formData, studentsPresent: parseInt(e.target.value)})} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Total Reg.</label>
              <input type="number" value={formData.totalRegistered} onChange={(e) => setFormData({...formData, totalRegistered: parseInt(e.target.value)})} className={inputClasses} />
            </div>
          </div>
        </section>

        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-on-surface w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Content</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Topic Taught</label>
              <textarea className={cn(inputClasses, "h-24 py-3 resize-none")} placeholder="Describe the main lecture topic..." value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Learning Outcomes</label>
              <textarea className={cn(inputClasses, "h-24 py-3 resize-none")} placeholder="Key takeaways for students..." value={formData.outcomes} onChange={(e) => setFormData({...formData, outcomes: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Recommendations</label>
              <textarea className={cn(inputClasses, "h-24 py-3 resize-none")} placeholder="Facilities or student feedback..." value={formData.recommendations} onChange={(e) => setFormData({...formData, recommendations: e.target.value})} />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-4">
          <button type="submit" disabled={loading} className="w-full h-12 bg-success text-on-success font-bold rounded-lg uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <CheckCircle size={20} />
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="w-full h-12 bg-surface-container border border-error text-error font-bold rounded-lg uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2">
            <XCircle size={20} />
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};
