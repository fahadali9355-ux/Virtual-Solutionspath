"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Calendar, User as UserIcon, Loader2 } from "lucide-react";

export default function AllStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/admin/students");
        const data = await res.json();
        if (data.students) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search Filter Logic
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading Students...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">All Students</h1>
           <p className="text-slate-500">Total {students.length} registered learners.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by name or email..." 
             className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- STUDENTS TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
               <tr>
                  <th className="p-4">Student Info</th>
                  <th className="p-4 hidden md:table-cell">Contact</th>
                  <th className="p-4 hidden sm:table-cell">Joined Date</th>
                  <th className="p-4 text-right">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {filteredStudents.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No students found matching your search.</td>
                 </tr>
               ) : (
                 filteredStudents.map((student) => (
                   <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase shrink-0">
                               {student.image ? (
                                 <img src={student.image} alt={student.name} className="w-full h-full rounded-full object-cover"/>
                               ) : (
                                 student.name.charAt(0)
                               )}
                            </div>
                            <div>
                               <p className="font-bold text-slate-800">{student.name}</p>
                               <p className="text-xs text-slate-500 md:hidden">{student.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-slate-600 font-medium">
                         <div className="flex items-center gap-2">
                            <Mail size={14} className="text-slate-400"/> {student.email}
                         </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-slate-500">
                         <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400"/> 
                            {new Date(student.createdAt).toLocaleDateString()}
                         </div>
                      </td>
                      <td className="p-4 text-right">
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                         </span>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

    </div>
  );
}