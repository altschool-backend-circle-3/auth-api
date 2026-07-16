import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
    minLength: [6, 'Password must be at least 6 characters'],
    maxLength: [100, 'Password must be less than 100 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // Automatically handles createdAt and updatedAt
});
// Hash the password before saving, but only if it was actually changed.
// Must be a regular function (not an arrow function) — this relies on this
// referring to the document being saved.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  // 12 salt rounds — standard cost factor for bcrypt as of 2026
  this.password = await bcrypt.hash(this.password, 12);
});
// Instance method to compare a plaintext password against the stored hash.
// Usage: await user.comparePassword(submittedPassword)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);
export default User;