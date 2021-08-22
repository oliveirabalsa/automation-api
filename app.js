const http = require("http");
const cors = require("cors");
const express = require("express");
const WebSocketService = require("./src/services/WebSocketService");
const service = require("./src/services/MessageConverterService");
const recovery = require('./src/files/recoveryState.json')

const port = process.env.PORT || 8080;
const host = '0.0.0.0'

(async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));

  const webSocketService = new WebSocketService(server);
  webSocketService.connect();

  app.post("/connect", async (req, res) => {
    const { action } = req.body;
    await webSocketService.sendMessage(action);

    console.log(action)

    await service({
        action,
      }
    );

    res.send("OK");
  });

  app.get("/current-step", async (req, res) => {
    res.status(200).json(recovery);
  });
  server.listen(port, host, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
