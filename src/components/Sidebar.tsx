'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import {
  Dashboard,
  Add,
  Logout,
  CalendarToday,
  Settings,
  CheckCircle,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { user, logout, loading } = useAuth(); 
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    console.log('=== SIDEBAR DEBUG ===');
    console.log('User object:', user);
    console.log('User name:', user?.name);
    console.log('User email:', user?.email);
    console.log('Loading:', loading);
    console.log('===================');
  }, [user, loading]);

  // Close profile menu when route changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Dashboard className="w-5 h-5" /> },
    { href: '/dashboard/tasks', label: 'My Tasks', icon: <CheckCircle className="w-5 h-5" /> },
    { href: '/dashboard/calendar', label: 'Calendar', icon: <CalendarToday className="w-5 h-5" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex">
        {/* Mobile Header during loading */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2 text-emerald-600">
            <Dashboard className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-slate-800">TaskFlow</span>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
        </header>
        
        {/* Desktop Sidebar during loading */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-screen shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-6 h-6 bg-emerald-100 rounded"></div>
              <span className="font-bold text-xl tracking-tight text-slate-800">TaskFlow</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header - Only logo and profile icon */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-emerald-600">
          <Dashboard className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-slate-800">TaskFlow</span>
        </div>
        
        {/* Profile Icon for Mobile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-500 text-white font-bold shadow-md focus:outline-none hover:shadow-lg transition-shadow"
            aria-label="Profile menu"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>
          
          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-md">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {user?.name || 'User'}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Links in Dropdown */}
                <div className="py-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-4 py-2.5 transition-all duration-200
                          ${isActive 
                            ? 'bg-emerald-50 text-emerald-700 font-medium' 
                            : 'text-slate-600 hover:bg-slate-50'
                          }
                        `}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className={`${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {item.icon}
                        </div>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                
                {/* Create Task Button in Dropdown */}
                <div className="px-4 py-2">
                  <Link
                    href="/dashboard/add"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Add className="w-4 h-4" />
                    Create Task
                  </Link>
                </div>
                
                {/* Logout Button */}
                <div className="px-4 py-2 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Logout className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Desktop Sidebar (unchanged) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-screen shrink-0">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <Dashboard className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-slate-800">TaskFlow</span>
          </div>
        </div>

        {/* User Profile - Green Theme */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Green Theme */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <div className={`${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions - Green Theme */}
        <div className="p-4 border-t border-slate-100 space-y-4">

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
          >
            <Logout className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Add margin for mobile header */}
      <div className="md:hidden h-16" />
    </>
  );
}