#include <ArduinoWebsockets.h>

const char* ssid = "WIFI_NAME"; // Nome da rede
const char* password = "123456"; // Senha da rede
const char* websockets_server_host = "192.168.1.x"; // IP do servidor websocket
const int websockets_server_port = 8080; // Porta de conexão do servidor

// Utilizamos o namespace de websocket para podermos utilizar a classe WebsocketsClient
using namespace websockets;

// Objeto websocket client
WebsocketsClient client;

// Led
const int quarto_casal = 23;
const int banheiro_casal = 22;
const int sala = 25;
const int quarto_visita = 26;
const int banheiro_visita = 27;
const int cozinha = 18;
const int lavanderia = 19;
const int corredor = 32;
void setup() 
{
    // Iniciamos a serial com velocidade de 115200
    Serial.begin(115200);

    // Definimos o pino como saída
    pinMode(quarto_casal, OUTPUT);
    pinMode(banheiro_casal, OUTPUT);
    pinMode(sala, OUTPUT);
    pinMode(quarto_visita, OUTPUT);
    pinMode(banheiro_visita, OUTPUT);
    pinMode(cozinha, OUTPUT);
    pinMode(lavanderia, OUTPUT);
    pinMode(corredor, OUTPUT);

    // Conectamos o wifi
    WiFi.begin(ssid, password);

    // Enquanto não conectar printamos um "."
    while(WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(1000);
    }

    // Exibimos "WiFi Conectado"
    Serial.println("Connected to Wifi, Connecting to server.");

    // Tentamos conectar com o websockets server
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");

    // Se foi possível conectar
    if(connected) 
    {
        // Exibimos mensagem de sucesso
        Serial.println("Connected!");
        // Enviamos uma msg "Hello Server" para o servidor
        client.send("Hello Server");
    }   // Se não foi possível conectar
    else 
    {
        // Exibimos mensagem de falha
        Serial.println("Not Connected!");
        return;
    }
    
    // Iniciamos o callback onde as mesagens serão recebidas
    client.onMessage([&](WebsocketsMessage message)
    {        
        // Exibimos a mensagem recebida na serial
        Serial.print("Got Message: ");
        Serial.println(message.data());

        // Ligamos/Desligamos o led de acordo com o comando
        if(message.data().equalsIgnoreCase("QUARTO CASAL ON"))
            digitalWrite(quarto_casal, HIGH);
        else
        if(message.data().equalsIgnoreCase("QUARTO CASAL OFF"))
            digitalWrite(quarto_casal, LOW);
            
        if(message.data().equalsIgnoreCase("BANHEIRO CASAL ON"))
            digitalWrite(banheiro_casal, HIGH);
        else
        if(message.data().equalsIgnoreCase("BANHEIRO CASAL OFF"))
            digitalWrite(banheiro_casal, LOW); 

        if(message.data().equalsIgnoreCase("SALA ON"))
            digitalWrite(sala, HIGH);
        else
        if(message.data().equalsIgnoreCase("SALA OFF"))
            digitalWrite(sala, LOW);

        if(message.data().equalsIgnoreCase("QUARTO VISITA ON"))
            digitalWrite(quarto_visita, HIGH);
        else
        if(message.data().equalsIgnoreCase("QUARTO VISITA OFF"))
            digitalWrite(quarto_visita, LOW);

        if(message.data().equalsIgnoreCase("BANHEIRO VISITA ON"))
            digitalWrite(banheiro_visita, HIGH);
        else
        if(message.data().equalsIgnoreCase("BANHEIRO VISITA OFF"))
            digitalWrite(banheiro_visita, LOW);

        if(message.data().equalsIgnoreCase("COZINHA ON"))
            digitalWrite(cozinha, HIGH);
        else
        if(message.data().equalsIgnoreCase("COZINHA OFF"))
            digitalWrite(cozinha, LOW);

        if(message.data().equalsIgnoreCase("LAVANDERIA ON"))
            digitalWrite(lavanderia, HIGH);
        else
        if(message.data().equalsIgnoreCase("LAVANDERIA OFF"))
            digitalWrite(lavanderia, LOW);

        if(message.data().equalsIgnoreCase("CORREDOR ON"))
            digitalWrite(corredor, HIGH);
        else
        if(message.data().equalsIgnoreCase("CORREDOR OFF"))
            digitalWrite(corredor, LOW);            
    });
}

void loop() 
{
    //  De tempo em tempo, o websockets client checa por novas mensagens recebidas
    if(client.available()) {
      client.poll();
    } else {
        ESP.restart();  
    }
        
    delay(300);
}
