"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 👈 useRouter add kia
import { 
  LayoutGrid, BookOpen, User, Settings, LogOut, 
  Menu, Bell, CheckCircle, AlertCircle
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // 👈 Redirect k liye
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("student@example.com");
  const [userImage, setUserImage] = useState<string | null>(null);

  // 👇 FUNCTION: Data Load karne k liye
  const loadUserData = () => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedImage = localStorage.getItem("profileImage");

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedImage) setUserImage(storedImage);
  };

  useEffect(() => {
    // 1. Check Login (Security)
    const email = localStorage.getItem("userEmail");
    if (!email) {
       router.push("/login");
       return;
    }

    // 2. Load Data
    loadUserData();

    // 3. Event Listener
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, [router]);

  // 👇 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear(); // Sara data saaf
    router.push("/login"); // Login page par bhejo
  };

  const menuItems = [
    { name: "Overview", icon: LayoutGrid, link: "/dashboard" },
    { name: "My Courses", icon: BookOpen, link: "/dashboard/courses" },
    { name: "Profile", icon: User, link: "/dashboard/profile" },
    { name: "Settings", icon: Settings, link: "/dashboard/settings" },
  ];

  const notifications = [
    { id: 1, text: "Web Development Class starts in 30 mins.", type: "alert", time: "Now" },
    { id: 2, text: "Assignment 'HTML Basics' graded: 90/100", type: "success", time: "2h ago" },
    { id: 3, text: "New course 'Freelancing' is now available.", type: "info", time: "1d ago" },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans">
      
      {/* 👇 1. MOBILE OVERLAY (Ye naya hai) 
          Jab menu khula hoga, ye peeche black color layega.
          Is par click karne se menu band ho jayega. 
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-[#082F49] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:w-64
      `}>
        
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#0C4A6E]">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
                <img src="/images/img1.png" alt="VSP Logo" className="w-8 h-8 object-contain" />
             </div>
             <span className="text-xl font-bold tracking-wide text-white">VSP.</span>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link 
                key={item.name} 
                href={item.link}
                // 👇 2. AUTO CLOSE ON CLICK
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-900/50" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* USER PROFILE (Sidebar Footer) */}
        <div className="p-4 mb-2">
          <div className="bg-[#0C4A6E] rounded-xl p-3 flex items-center gap-3 border border-white/5 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-[#082F49] shrink-0 overflow-hidden flex items-center justify-center">
                {userImage ? (
                    <img src={userImage} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{userName}</p>
                 <p className="text-xs text-blue-200 truncate" title={userEmail}>{userEmail}</p>
              </div>
              
              {/* Logout Button Update */}
              <button onClick={handleLogout} title="Logout">
                 <LogOut size={18} className="text-blue-300 hover:text-red-400 cursor-pointer transition-colors" />
              </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-30">
           <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
                <Menu />
             </button>
             <h2 className="text-lg font-bold text-slate-800 hidden md:block">Dashboard</h2>
           </div>

           {/* Notifications Area */}
           <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
              >
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <>
                {/* Backdrop for Notif */}
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="text-sm text-slate-700 font-medium leading-snug">{notif.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-slate-100">
                    <Link href="/dashboard/settings" className="text-xs font-bold text-blue-600 hover:underline">
                      View Settings
                    </Link>
                  </div>
                </div>
                </>
              )}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F1F5F9]">
           {children}
        </main>
      </div>
    </div>
  );
}