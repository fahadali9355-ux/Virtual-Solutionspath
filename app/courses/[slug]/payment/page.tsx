import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import PaymentForm from "@/components/PaymentForm"; // 👈 Jo abhi component banaya wo import karein

export default async function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. URL se Slug nikalein
  const { slug } = await params;

  // 2. Database connect karein
  await connectDB();
  
  // 3. Course dhoondein
  const courseRaw = await Course.findOne({ slug }).lean();

  // Agar course na mile
  if (!courseRaw) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
            Course Not Found in Database
        </div>
      );
  }

  // 4. Data ko simple JSON main convert karein (Error se bachne k liye)
  const course = JSON.parse(JSON.stringify(courseRaw));

  // 5. Form Component ko data pass karein
  return <PaymentForm course={course} />;
}