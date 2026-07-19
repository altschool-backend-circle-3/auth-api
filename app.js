import express from 'express';
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
// route imports
import authRouter from './routes/authRoutes.js';

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

// route declaration
app.use("/api/auth", authRouter)

export default app;