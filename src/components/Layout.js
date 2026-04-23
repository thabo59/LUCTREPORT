import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Menu } from 'lucide-react';
import { useAuth } from '../AuthProvider';
import { cn } from '../lib/utils';

export const Layout = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 mokorotlo-pattern pointer-events-none z-0" />
      
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant shadow-sm backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-on-surface cursor-pointer" />
          <h1 className="font-sans font-bold tracking-tight text-on-surface text-lg uppercase tracking-widest">
            LRS Lesotho
          </h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container">
          <img 
            alt="User profile" 
            className="w-full h-full object-cover" 
            src={`https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=random`} 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-24 px-4 relative z-10 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe bg-surface border-t border-outline-variant shadow-lg backdrop-blur-sm bg-opacity-95">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-4 transition-all duration-200 rounded-lg",
                isActive ? "bg-surface-container-high text-success scale-105" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current opacity-20")} size={24} />
              <span className="text-[11px] font-medium uppercase tracking-tighter">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
