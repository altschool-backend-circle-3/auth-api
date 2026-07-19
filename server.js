import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 8000;
        const server = app.listen(PORT, () => {
            console.info(`Server is running on port: ${PORT}`);

        })
        server.on("error", (error) => {
            console.error("ERROR", error);
            throw error;
        });
    } catch (error) {
        console.error("MongoDb connection failed", error);
        process.exit(1);
    }
}
startServer()