import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed width, no scrolling */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}