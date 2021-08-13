const WebSocketServer = require("websocket").server;

class WebSocketService {
  constructor(server) {
    this.wsServer = new WebSocketServer({
      httpServer: server,
    });
    this.state = false;
  }

  async connect() {
    let intervalo = 200;
    this.wsServer.on("request", (request) => {
      const client = request.accept(null, request.origin);
      client.on("message", (message) => {
        if (message.type === "utf8") {
          console.log(message.utf8Data);
        }
      });
      const interval = setInterval(() => {
        client.sendUTF(this.state);
      }, intervalo);
      client.on("close", () => {
        console.log("Conexão fechada");
        //Remove o intervalo de envio de estado
        clearInterval(interval);
      });
    });
  }

  async sendMessage(message) {
    this.state = message;
  }
}

module.exports = WebSocketService;
