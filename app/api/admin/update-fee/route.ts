import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // Frontend se data receive karein
    const { userId, courseSlug, newPaidAmount, newTotalFee } = await req.json();
    
    await connectDB();

    // 1. Pehle User dhundo (Taa k uski email mil sake)
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Ab Payment Record dhundo (User ki Email aur CourseSlug se)
    // Hum Payment model main check kar rahe hain kyunke ab fees wahin manage ho rahi hain
    let payment = await Payment.findOne({ 
        email: user.email, 
        courseSlug: courseSlug 
    });

    if (payment) {
        // --- CASE A: Record Mil Gaya (Update karo) ---
        
        // Paid Amount Update
        payment.amount = Number(newPaidAmount);
        
        // Custom Total Fee (Discount Logic) Update
        // Ye field humne Payment model main naya add kiya hai
        if (newTotalFee) {
            payment.customTotalFee = Number(newTotalFee);
        }

        // Status update logic (Optional: Agar full pay ho gaya tu status approved rakho)
        // payment.status = "approved"; 

        await payment.save();
    
    } else {
        // --- CASE B: Record Nahi Mila (Edge Case: Naya banao) ---
        // Agar payment record missing hai (shayad manual enrollment thi), tu naya bana do
        
        const newPayment = new Payment({
            name: user.name,
            email: user.email,
            courseSlug: courseSlug,
            amount: Number(newPaidAmount),
            customTotalFee: Number(newTotalFee), // Nayi fee set kardi
            status: "approved", // Admin kar raha hai to approved hi hoga
            method: "Manual Entry (Admin)",
            image: "", // Koi screenshot nahi kyunke admin ne add kia
            date: new Date()
        });

        await newPayment.save();
    }

    return NextResponse.json({ message: "Fee & Discount Updated Successfully" });

  } catch (error: any) {
    console.error("Update Fee Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}