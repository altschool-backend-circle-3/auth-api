import express from 'express';
import cors from "cors";
import authRouter from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

// route declaration
app.use("/api/auth", authRouter)

export default app;