const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = new Client({ authStrategy: new LocalAuth() });

app.use(express.static("public"));
app.use(express.json());

// QR Code para o bot
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  io.emit("qr", qr);  // Envia o QR Code para o front-end
});

// Quando o bot estiver pronto
client.on("ready", () => {
  console.log("Bot está online!");
  io.emit("ready", "Bot está online!");  // Envia para o front-end que o bot está online
});

// Comunicação com o bot (mensagens do front-end)
io.on("connection", (socket) => {
  console.log("Usuário conectado");

  socket.on("mensagem", (msg) => {
    const chatId = msg.chatId;
    client.sendMessage(chatId, msg.text);  // Envia a mensagem para o WhatsApp
  });
});

// Iniciar o bot
client.initialize();

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
