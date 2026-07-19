import express from 'express';
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

import authRouter from './routes/authRoutes.js';

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

// sample route to test authMiddleware
// app.use("/api/v1", authRouter)

export default app;