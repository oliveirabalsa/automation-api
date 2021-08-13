const http = require("http");
const WebSocketService = require("./src/services/WebSocketService");
const express = require("express");
const cors = require("cors");
const port = 8080;

(async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));

  const webSocketService = new WebSocketService(server);
  webSocketService.connect();

  app.post("/connect", async(req, res) => {
    const { action } = req.body;
    await webSocketService.sendMessage(action);
    res.send("OK")
  });
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
