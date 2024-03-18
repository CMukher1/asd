if (!process.env.ALREADY_SET) {
  require("dotenv").config();
}
process.env.TZ = "Asia/Kolkata";
import http from "http";
import App from "@/App";
import { Logger } from "@/libs/logger";
import { DatabaseService } from "@/Database/Config";
import { initializeSocket } from "./Socket";

const logger: any = new Logger();

DatabaseService.getConnection().then(() => {
  const server = http.createServer(App).listen(parseInt(process.env.PORT || "5000", 10));
  initializeSocket(server);
  server.on("listening", async () => {
    logger.log("info", `Sample app listening on ${JSON.stringify(server.address())}`);
  });
  logger.log("info", `Sample app listening on ${JSON.stringify(server.address())}`);
});
