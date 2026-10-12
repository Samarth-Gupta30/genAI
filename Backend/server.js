import dns from "node:dns";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const { promises: dnsPromises } = dns;
dnsPromises.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

connectToDB();

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
