import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ChevronDown, PersonStanding, Lock, Eye, EyeOff, ArrowRight, Castle, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const Login = () => {
  const [role, setRole] = useState('lecturer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          userId: userCredential.user.uid,
          email,
          displayName: email.split('@')[0],
          role,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 basotho-pattern pointer-events-none opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        <header className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-surface-container border border-outline-variant flex items-center justify-center rounded-lg shadow-sm">
              <ShieldAlert className="text-on-surface w-10 h-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-widest uppercase">LRS Lesotho</h1>
          <p className="text-sm text-on-surface-variant mt-2 font-medium opacity-80">Lecture Reporting System</p>
        </header>

        <section className="w-full bg-surface-container border border-outline-variant p-8 rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error/10 border border-error p-3 rounded text-error text-xs font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">User Role</label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-12 bg-background border border-outline-variant text-on-surface text-sm px-4 rounded focus:ring-1 focus:ring-success focus:border-success appearance-none outline-none transition-all"
                >
                  <option value="lecturer">Lecturer</option>
                  <option value="student">Student</option>
                  <option value="prl">PRL</option>
                  <option value="pl">PL</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <PersonStanding className="w-5 h-5 text-on-surface-variant" />
                </span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-background border border-outline-variant text-on-surface text-sm pl-11 pr-4 rounded focus:ring-1 focus:ring-success focus:border-success placeholder:text-surface-bright outline-none transition-all"
                  placeholder="e.g. m.thabo@university.ls"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="w-5 h-5 text-on-surface-variant" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-background border border-outline-variant text-on-surface text-sm pl-11 pr-12 rounded focus:ring-1 focus:ring-success focus:border-success placeholder:text-surface-bright outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-on-surface-variant" /> : <Eye className="w-5 h-5 text-on-surface-variant" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant bg-background text-success focus:ring-0" />
                <span className="text-xs text-on-surface-variant">Remember me</span>
              </label>
              <button type="button" className="text-xs text-success font-medium hover:underline">Forgot password?</button>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-success hover:bg-success/90 active:scale-95 transition-all text-on-success font-bold text-sm rounded shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:active:scale-100"
              >
                <span>{loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-10 text-center space-y-6 w-full">
          <p className="text-xs text-on-surface-variant">
            {isRegistering ? 'Already have an account?' : 'New staff member?'} 
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-on-surface font-bold hover:underline ml-1"
            >
              {isRegistering ? 'Login here' : 'Request account'}
            </button>
          </p>
          
          <div className="pt-8 opacity-20 flex flex-col items-center">
            <Castle className="w-12 h-12 text-on-surface" />
            <p className="text-[10px] uppercase tracking-widest mt-2 text-on-surface font-bold">Kingdom of Lesotho</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};
