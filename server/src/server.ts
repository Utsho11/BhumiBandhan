import { Server } from "http";
import app from "./app";
import config from "./config";
import { initDatabase } from "./utils/initDb";

async function main() {
  const port = config.port;

  // Initialize PostgreSQL database tables and seed records
  await initDatabase();

  const server: Server = app.listen(port, () => {
    console.log(`\x1b[32m✔ BhumiBandhan Backend Server is running successfully on http://localhost:${port}\x1b[0m`);
    console.log(`\x1b[36m✔ Primary Language: বাংলা (Bangla) | PostgreSQL Database Connected\x1b[0m`);
    console.log(`\x1b[35m✔ Team: Porcha Builder DIU | Track: Digital Land Records & Verification\x1b[0m`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed safely.");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

main();
