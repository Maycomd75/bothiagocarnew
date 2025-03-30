// Função para gerar o QR Code
window.onload = function() {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
      text: "https://www.meuchatbot.com",  // Substitua por seu link real para o chatbot
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  };
  
  // Funções de exemplo para o chat (Simulação)
  function criarOrcamento() {
    alert("Função Criar Orçamento!");
  }
  
  function agendarServico() {
    alert("Função Agendar Serviço!");
  }
  
  function gerenciarAgendamentos() {
    alert("Função Gerenciar Agendamentos!");
  }
  
  function gerenciarOrcamentos() {
    alert("Função Gerenciar Orçamentos!");
  }
  
  function enviarMensagem() {
    var input = document.getElementById("chat-input").value;
    if (input.trim()) {
      var chatBox = document.getElementById("chat-box");
      var msg = document.createElement("div");
      msg.classList.add("mb-2");
      msg.textContent = input;
      chatBox.appendChild(msg);
      document.getElementById("chat-input").value = "";  // Limpar campo de entrada
      chatBox.scrollTop = chatBox.scrollHeight;  // Rolar para a última mensagem
    }
  }
  
  function toggleChat() {
    var chatBox = document.getElementById("chat-box");
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
  }
  