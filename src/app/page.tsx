import React from 'react'
import Link from 'next/link'
import { KanbanSquare, Sparkles, CheckCircle2, ArrowRight, MoreHorizontal, Paperclip } from 'lucide-react'

function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white selection:bg-emerald-100 flex flex-col font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-linear-to-br from-emerald-100/40 to-teal-100/40 blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-linear-to-tr from-lime-50/60 to-green-50/60 blur-3xl" />
         <div className="absolute top-[20%] left-[15%] w-24 h-24 bg-emerald-50 rounded-full blur-xl animate-bounce" style={{animationDuration: '3s'}} />
      </div>

      {/* Navigation Bar */}
      <nav className="w-full px-6 md:px-12 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110 duration-300">
            <KanbanSquare size={24} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            TaskFlow<span className="text-emerald-600">.</span>
          </span>
        </div>

        {/* Login and Sign In buttons on right */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden md:block px-5 py-2.5 text-slate-600 font-medium hover:text-emerald-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 lg:px-12 w-full gap-12 lg:gap-20 ">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 z-10 max-w-2xl">
          <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs uppercase tracking-wide border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> v2.0 Live
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Organize work, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">amplify results.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
              The intelligent task management platform designed for modern teams. 
              Seamlessly manage projects with AI-powered assistance and drag-and-drop simplicity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-100">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Start for free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
            >
              Live Demo
            </Link>
          </div>
          
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-slate-400 text-sm animate-in fade-in duration-1000 delay-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Free Forever
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> No Credit Card
            </div>
          </div>
        </div>

        {/* Visual / Graphic (Floating Cards) */}
        <div className="hidden -mt-22 lg:block flex-1 relative h-[600px] w-full animate-in fade-in zoom-in duration-1000 delay-200">
          {/* Abstract Card Stack */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px]">
            {/* Back Card (Context) */}
            <div className="absolute top-0 right-[-50px] w-80 h-64 bg-slate-50 rounded-3xl -rotate-6 shadow-lg border border-slate-100 flex flex-col p-4 opacity-60 scale-95 origin-bottom-left">
              <div className="w-full h-full bg-white rounded-2xl border border-slate-200 p-4 opacity-50">
                <div className="h-4 w-1/3 bg-slate-100 rounded-full mb-4"/>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-50 rounded-full"/>
                  <div className="h-2 w-2/3 bg-slate-50 rounded-full"/>
                </div>
              </div>
            </div>
            
            {/* Middle Card (Another Task) */}
            <div className="absolute top-16 right-[-25px] w-80 h-[400px] bg-white rounded-3xl -rotate-3 shadow-xl border border-slate-200 p-5 flex flex-col opacity-90">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">DESIGN</span>
                <MoreHorizontal size={16} className="text-slate-300"/>
              </div>
              <div className="h-32 bg-blue-50 rounded-xl mb-4 w-full overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-indigo-50 opacity-50"></div>
              </div>
              <div className="h-4 w-3/4 bg-slate-100 rounded-full mb-2"/>
              <div className="h-2 w-1/2 bg-slate-50 rounded-full"/>
            </div>

            {/* Front Card (Main Hero UI) */}
            <div className="absolute top-28 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col rotate-0 hover:-translate-y-2 transition-transform duration-500 z-10">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">Q4 Marketing Strategy</h3>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Growth Team • Due in 2 days</p>
                </div>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-rose-100">High</span>
              </div>

              {/* Rich Media Content */}
              <div className="w-full h-32 bg-slate-100 rounded-xl mb-5 overflow-hidden relative group border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80" 
                  alt="Analytics Chart" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                  <Paperclip size={10} /> 3
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-600">Progress</span>
                  <span className="text-emerald-600 font-bold">75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 group/item cursor-default">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-50 transition-colors">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-slate-400 line-through decoration-slate-300">Draft content plan</span>
                </div>
                <div className="flex items-center gap-3 group/item cursor-default">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover/item:border-emerald-400 transition-colors bg-white"></div>
                  <span className="text-sm text-slate-700 font-medium">Review with stakeholders</span>
                </div>
              </div>
              
              {/* Footer: Avatars & Action */}
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2 pl-1">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" 
                    alt="User 1" 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" 
                    alt="User 2" 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold shadow-sm">+3</div>
                </div>
                <button className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Floating Status Badge */}
            <div className="absolute bottom-16 -left-8 bg-white/90 backdrop-blur-md p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-3 animate-bounce z-20" style={{animationDuration: '3s'}}>
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Productivity</p>
                <p className="text-sm font-bold text-slate-800">All Systems Go</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Page