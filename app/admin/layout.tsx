"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Award, LogOut, Menu, Loader2, Plus, Edit, CreditCard , Settings } from "lucide-react"; // 👈 CreditCard added

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Security Check
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100 text-slate-500 gap-2">
        <Loader2 className="animate-spin" /> Verifying Admin Access...
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin" },
    { name: "Fee Verification", icon: CreditCard, link: "/admin/payments" }, // 👈 NEW: Payment Page Link
    { name: "Manage Courses", icon: Edit, link: "/admin/manage-courses" },
    { name: "Add New Course", icon: Plus, link: "/admin/add-course" },
    { name: "Certificate Requests", icon: Award, link: "/admin/certificates" },
    { name: "All Students", icon: Users, link: "/admin/students" },
    
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden glass"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:w-64
      `}>
        
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-slate-950">
          <img src="/images/img1.png" alt="Course Image" className="w-10 h-10 m-2 rounded-lg" />
           <div className="text-lg font-bold tracking-wide text-white block"> VSP Admin</div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link 
                key={item.name} 
                href={item.link}
                onClick={() => setSidebarOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium
                  ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 transition-colors">
             <LogOut size={18} /> <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-30">
           {/* Hamburger Button */}
           <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
           </button>
           
           <h2 className="text-lg font-bold text-slate-800 ml-2">Admin Dashboard</h2>
           
           <div className="ml-auto w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">A</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100">
           {children}
        </main>
      </div>
    </div>
  );
}