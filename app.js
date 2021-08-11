const WebSocketServer = require("websocket").server;
const http = require("http");

//Porta que o server irá escutar
const port = 8080;

//Cria o server
const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (["GET", "POST"].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});

//Server irá escutar na porta definida em 'port'
server.listen(port, () => {
  //Server está pronto
  console.log(`Server está executando na porta ${port}`);
});

// Cria o WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server,
});
let intervalo = 200;
let state = false;
//Chamado quando um client deseja conectar
wsServer.on("request", (request) => {
  //Estado do led: false para desligado e true para ligado

  //Aceita a conexão do client
  let client = request.accept(null, request.origin);

  //Chamado quando o client envia uma mensagem
  client.on("message", (message) => {
    //Se é uma mensagem string utf8
    if (message.type === "utf8") {
      //Mostra no console a mensagem
      console.log(message.utf8Data);
    }
  });

  //Cria uma função que será executada a cada 1 segundo (1000 millis) para enviar o estado do led
  const interval = setInterval(() => {
    //Envia para o client "ON" ou "OFF" dependendo do estado atual da variável state
    client.sendUTF(state);
  }, intervalo); //Tempo entre chamadas => 1000 millis = 1 segundo

  //Chamado quando a conexão com o client é fechada
  client.on("close", () => {
    console.log("Conexão fechada");
    //Remove o intervalo de envio de estado
    clearInterval(interval);
  });
});
server.on("request", (request, response) => {
  request.on("data", (data) => {
    const res = JSON.parse(data.toString("utf8"));
    state = res.action;
  });
  response.end();
});
