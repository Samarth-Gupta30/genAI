import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const port = Number(process.env.PORT) || 3000;

try {
    await connectToDB();
    app.listen(port, "0.0.0.0", () => {
        console.log(`Listening on port ${port}`);
    });
} catch (error) {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
}
