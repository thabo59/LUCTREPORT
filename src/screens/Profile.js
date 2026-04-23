import React from 'react';
import { useAuth } from '../AuthProvider';
import { LogOut, Mail, Shield, Building, Database } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';

export const Profile = () => {
  const { profile, signOut } = useAuth();

  const seedData = async () => {
    if (!profile) return;
    try {
      const demoLectures = [
        {
          courseCode: 'CS401',
          topic: 'Software Engineering Principles',
          studentsPresent: 38,
          totalRegistered: 40,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          lecturerId: profile.userId,
          createdAt: serverTimestamp(),
        },
        {
          courseCode: 'MA205',
          topic: 'Vector Spaces and Linear Transforms',
          studentsPresent: 32,
          totalRegistered: 40,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          lecturerId: profile.userId,
          createdAt: serverTimestamp(),
        }
      ];

      for (const l of demoLectures) {
        await addDoc(collection(db, 'lectures'), l);
      }
      alert('Demo data seeded successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <header className="text-center py-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-outline-variant mx-auto mb-4 bg-surface-container shadow-xl">
          <img alt="Profile" src={`https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&size=128&background=random`} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">{profile?.displayName}</h2>
        <p className="text-sm text-on-surface-variant uppercase tracking-widest font-medium">{profile?.role}</p>
      </header>
      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-outline-variant">
          <Mail className="text-on-surface-variant" size={20} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Email Address</p>
            <p className="text-sm text-on-surface">{profile?.email}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-4 border-b border-outline-variant">
          <Shield className="text-on-surface-variant" size={20} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Role Permissions</p>
            <p className="text-sm text-on-surface">{profile?.role?.toUpperCase()} ACCESS</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-4">
          <Building className="text-on-surface-variant" size={20} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Institution</p>
            <p className="text-sm text-on-surface">Limkokwing University (LUCT)</p>
          </div>
        </div>
      </section>
      <div className="space-y-3 pt-4">
        <button onClick={seedData} className="w-full h-12 bg-surface-container-high border border-outline-variant text-on-surface font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Database size={18} /> Seed Demo Data
        </button>
        <button onClick={signOut} className="w-full h-12 bg-error/10 border border-error text-error font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </motion.div>
  );
};
