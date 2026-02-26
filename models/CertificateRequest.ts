import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  courseId: { type: String, required: true }, // Slug store karenge
  courseTitle: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", },
  requestDate: { type: Date, default: Date.now, },
});

const CertificateRequest = mongoose.models.CertificateRequest || mongoose.model("CertificateRequest", RequestSchema);

export default CertificateRequest;