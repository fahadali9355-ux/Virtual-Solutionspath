import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  studentName: String,
  email: String,
  courseTitle: String,
  courseSlug: String,
  amount: String,
  trxId: { type: String, required: true }, // Sab se zaroori cheez
  method: String, 
  status: { type: String, default: "pending" },
  customTotalFee: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;