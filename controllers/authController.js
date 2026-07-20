import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body
        // basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        // check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "email already in use" })
        }
        const user = await User.create({
            email, password
        })
        // 4. Generate token and respond
        const token = generateToken(user._id);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: { id: user._id, email: user.email },
                token // Provide the token so the frontend can store it
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
export { signupUser }