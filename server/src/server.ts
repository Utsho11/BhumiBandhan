import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const port = config.port;

  const server: Server = app.listen(port, () => {
    console.log(`\x1b[32m✔ BhumiBandhan Backend Server is running successfully on http://localhost:${port}\x1b[0m`);
    console.log(`\x1b[36m✔ Primary Language: বাংলা (Bangla) | E-Governance API Active\x1b[0m`);
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
