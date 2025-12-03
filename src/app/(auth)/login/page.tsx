'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { Mail, Lock, ArrowLeft, LogIn as LoginIcon, } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* LEFT SIDE - VISUAL */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Image & Overlay */}
        <div className="absolute inset-0 bg-emerald-900/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-emerald-900/20 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
          alt="Workspace"
          className="w-full h-full object-cover opacity-90 animate-in fade-in zoom-in duration-2000"
        />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 p-16 z-20 text-white space-y-6 max-w-xl">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-emerald-900/20 backdrop-blur-sm bg-opacity-90">
             <LoginIcon size={28} />
          </div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Focus on what matters most.</h2>
          <p className="text-emerald-100 text-lg opacity-90 leading-relaxed">
            "TaskFlow has completely transformed how our team collaborates. The AI features are a game changer."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
         <Link 
            href="/" 
            className="absolute top-8 left-8 text-slate-400 hover:text-emerald-600 flex items-center gap-2 text-sm font-medium transition-colors group"
         >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
         </Link>

         <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
             <div className="text-center lg:text-left space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  Welcome Back!
                </h1>
                <p className="text-slate-500 text-lg">
                  Please enter your details to sign in to your account.
                </p>
             </div>

             {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-5">
               {/* Email Input */}
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="email" 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                      placeholder="you@example.com" 
                    />
                  </div>
               </div>
               
               {/* Password Input */}
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="password" 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                      placeholder="••••••••" 
                    />
                  </div>
               </div>

               {/* Remember me & Forgot password */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   <input
                     id="remember-me"
                     name="remember-me"
                     type="checkbox"
                     className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                   />
                   <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                     Remember me
                   </label>
                 </div>
                 <Link 
                   href="#" 
                   className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
                 >
                   Forgot password?
                 </Link>
               </div>
               
               {/* Submit Button */}
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform active:scale-[0.99] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
               >
                 {loading ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Signing in...
                   </>
                 ) : (
                   <>
                     <LoginIcon className="w-5 h-5 mr-2" />
                     Sign In
                   </>
                 )}
               </button>
             </form>

             <div className="text-center">
                <p className="text-slate-500">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
             </div>
         </div>
      </div>
    </div>
  );
}