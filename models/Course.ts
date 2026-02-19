import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // URL k liye (e.g., web-dev)
  category: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true }, // e.g., "Rs. 5,000"
  duration: { type: String, required: true },
  lessons: { type: String, required: true },
  desc: { type: String, required: true },
  learningPoints: { type: [String], default: [] },
  curriculum: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;