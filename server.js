import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config({
    path: "./.env"
});

const startServer = async () => {
    try {
        await connectDB();
        app.on("error", (error) => {
            console.error("ERROR", error);
            throw error;
        });
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.info(`Server is running on port: ${PORT}`);

        })
    } catch (error) {
        console.error("MongoDb connection failed", error);
    }
}
startServer()