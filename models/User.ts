import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  phone: {
    type: String,
    default: "",
  },
  // 👇 Ye Field add karna zaroori hai
  image: {
    type: String, // Hum image ko text (Base64) bana kar save karenge
    default: "",
  },
  role: {
    type: String,
    default: "student", // student or admin
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  
  enrolledCourses: {
    type: [String], // Courses k IDs yahan save honge
    default: []},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;