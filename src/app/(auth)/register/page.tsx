'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { Mail, Lock, ArrowLeft, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
             <UserPlus size={28} />
          </div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Join thousands of productive teams.</h2>
          <p className="text-emerald-100 text-lg opacity-90 leading-relaxed">
            "Getting started with TaskFlow was effortless. Our productivity increased by 40% in the first month."
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
                <h1 className="text-2xl lg:text-2xl font-bold text-slate-900 tracking-tight">
                  Create an Account
                </h1>
                <p className="text-slate-500 text-1xl">
                  Join us and start organizing your tasks efficiently.
                </p>
             </div>

             {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-2.1">
               {/* Name Input */}
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="name" 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                      placeholder="John Doe" 
                    />
                  </div>
               </div>

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
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                      placeholder="At least 6 characters" 
                    />
                  </div>
               </div>

               {/* Confirm Password Input */}
               <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="confirmPassword" 
                      type="password" 
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                      placeholder="Confirm your password" 
                    />
                  </div>
               </div>
               
               {/* Terms Agreement */}
               <div className="flex items-center mt-3">
                 <input
                   id="terms"
                   name="terms"
                   type="checkbox"
                   required
                   className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                 />
                 <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                   I agree to the{' '}
                   <Link href="#" className="text-emerald-600 hover:text-emerald-800 font-medium">Terms of Service</Link>
                   {' '}and{' '}
                   <Link href="#" className="text-emerald-600 hover:text-emerald-800 font-medium">Privacy Policy</Link>
                 </label>
               </div>
               
               {/* Submit Button */}
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform active:scale-[0.99] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
               >
                 {loading ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Creating Account...
                   </>
                 ) : (
                   <>
                     <UserPlus className="w-5 h-5 mr-2" />
                     Create Account
                   </>
                 )}
               </button>
             </form>

             <div className="text-center">
                <p className="text-slate-500">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
             </div>
         </div>
      </div>
    </div>
  );
}