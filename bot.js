const { Client, LocalAuth } = require("whatsapp-web.js");
const { salvarOrcamento, salvarAgendamento } = require("./database");

const client = new Client({ authStrategy: new LocalAuth() });
const clientes = new Map();

// Lista de serviços
const servicosMap = {
    "1": { nome: "Alinhamento", preco: 150 },
    "2": { nome: "Balanceamento", preco: 100 },
    "3": { nome: "Troca de Óleo", preco: 120 },
    "4": { nome: "Troca de Filtro", preco: 80 },
    "5": { nome: "Suspensão", preco: 400 },
    "6": { nome: "Direção Hidráulica", preco: 350 },
};

client.on("qr", (qr) => {
    const qrcode = require("qrcode-terminal");
    qrcode.generate(qr, { small: true });
    console.log("✅ QR Code gerado! Escaneie com o WhatsApp.");
});

client.on("ready", () => console.log("✅ Bot Hiago Car está online!"));

client.on("message", async (msg) => {
    const chatId = msg.from;
    const mensagem = msg.body.trim().toLowerCase();

    if (!clientes.has(chatId)) {
        clientes.set(chatId, {
            etapa: "",
            nomeCliente: "",
            telefoneCliente: "",
            placa: "",
            modelo: "",
            ano: "",
            servicosSelecionados: []
        });
    }
    const cliente = clientes.get(chatId);

    if (["oi", "olá", "boa tarde", "boa noite", "menu"].includes(mensagem)) {
        cliente.etapa = "";
        cliente.servicosSelecionados = [];
        client.sendMessage(chatId, `🚗 *Bem-vindo à Hiago Car!* 🔧
            
🏪 *Endereço:* Av Perimetral, Quadra 06, Lote 16 A Vale do Sol.,  
🌆 *Cidade:* Palmas-To
📍 *Cep:* 77064-324 
📞 *Telefone:* (63)99264-5216

⌚ *Atendimento: Segunda a Sexta, 08h às 18h.*
⚙️ *Hiago Car – Qualidade e confiança para o seu veículo!*

Escolha uma opção:
1️⃣ Orçamento
2️⃣ Agendamento
3️⃣ Falar com Atendente


Digite o número desejado.`);
    }

    // Fluxo de orçamento
    else if (mensagem === "1" && cliente.etapa === "") {
        cliente.etapa = "nome";
        client.sendMessage(chatId, "Digite seu *Nome*:");
    } else if (cliente.etapa === "nome") {
        cliente.nomeCliente = mensagem;
        cliente.etapa = "placa";
        client.sendMessage(chatId, "Digite a *Placa do Veículo*:");
    } else if (cliente.etapa === "placa") {
        cliente.placa = mensagem;
        cliente.etapa = "modelo";
        client.sendMessage(chatId, "Digite o *Modelo do Veículo*:");
    } else if (cliente.etapa === "modelo") {
        cliente.modelo = mensagem;
        cliente.etapa = "ano";
        client.sendMessage(chatId, "Digite o *Ano do Veículo*:");
    } else if (cliente.etapa === "ano") {
        cliente.ano = mensagem;
        cliente.etapa = "servicos";
        client.sendMessage(chatId, `💪 Escolha os serviços:
1️⃣ Alinhamento: R$ 150,00
2️⃣ Balanceamento: R$ 100,00
3️⃣ Troca de Óleo: R$ 120,00
4️⃣ Troca de Filtro: R$ 80,00
5️⃣ Suspensão: R$ 400,00
6️⃣ Direção Hidráulica: R$ 350,00

✅ Digite o número do serviço desejado para adicioná-lo ao orçamento.
✅ Digite *finalizar* para concluir.`);
    } else if (cliente.etapa === "servicos" && servicosMap[mensagem]) {
        cliente.servicosSelecionados.push(servicosMap[mensagem]);
        client.sendMessage(chatId, `✅ *${servicosMap[mensagem].nome}* adicionado ao orçamento. 
Você pode adicionar mais serviços digitando outro número ou digitar *finalizar* para concluir.`);
    } else if (cliente.etapa === "servicos" && mensagem === "finalizar") {
        if (cliente.servicosSelecionados.length === 0) {
            client.sendMessage(chatId, "⚠️ Você não selecionou nenhum serviço. Escolha pelo menos um antes de finalizar.");
        } else {
            const total = cliente.servicosSelecionados.reduce((sum, s) => sum + s.preco, 0);
            await salvarOrcamento(cliente.nomeCliente, cliente.placa, cliente.modelo, cliente.ano, cliente.servicosSelecionados, total);

            client.sendMessage(chatId, `🧾 *Orçamento Hiago Car*
🏢 Empresa: Hiago Car
📞 WhatsApp: 63992645216
👤 Cliente: ${cliente.nomeCliente}
🚘 Placa: ${cliente.placa}
🚗 Modelo: ${cliente.modelo}
📅 Ano: ${cliente.ano}

💪 Serviços escolhidos:
${cliente.servicosSelecionados.map(s => `🔧 ${s.nome}: R$ ${s.preco},00`).join("\n")}

💰 *Total: R$ ${total},00*

Digite *menu* para voltar ao menu principal.`);
            clientes.delete(chatId);
        }
    }

    // Fluxo de agendamento
    else if (mensagem === "2" && cliente.etapa === "") {
        cliente.etapa = "nomeAgendamento";
        client.sendMessage(chatId, "Digite seu *Nome* para o agendamento:");
    } else if (cliente.etapa === "nomeAgendamento") {
        cliente.nomeCliente = mensagem;
        cliente.etapa = "telefoneAgendamento";
        client.sendMessage(chatId, "Digite seu *Telefone* para contato:");
    } else if (cliente.etapa === "telefoneAgendamento") {
        cliente.telefoneCliente = mensagem;
        cliente.etapa = "placaAgendamento";
        client.sendMessage(chatId, "Digite a *Placa do Veículo* para agendamento:");
    } else if (cliente.etapa === "placaAgendamento") {
        cliente.placa = mensagem;
        cliente.etapa = "modeloAgendamento";
        client.sendMessage(chatId, "Digite o *Modelo do Veículo* para agendamento:");
    } else if (cliente.etapa === "modeloAgendamento") {
        cliente.modelo = mensagem;
        cliente.etapa = "anoAgendamento";
        client.sendMessage(chatId, "Digite o *Ano do Veículo* para agendamento:");
    } else if (cliente.etapa === "anoAgendamento") {
        cliente.ano = mensagem;
        cliente.etapa = "dataAgendamento";
        client.sendMessage(chatId, "📅 Informe a *data do agendamento* (DD/MM/AAAA):");
    } else if (cliente.etapa === "dataAgendamento" && mensagem.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        cliente.dataAgendamento = mensagem;
        cliente.etapa = "horarioAgendamento";
        client.sendMessage(chatId, "⏰ Informe o *horário do agendamento* (HH:MM):");
    } else if (cliente.etapa === "horarioAgendamento" && mensagem.match(/^\d{2}:\d{2}$/)) {
        cliente.horarioAgendamento = mensagem; 

        // Salva no MongoDB
        await salvarAgendamento(cliente.nomeCliente, cliente.telefoneCliente, cliente.placa, cliente.modelo, cliente.dataAgendamento, cliente.horarioAgendamento);

    client.sendMessage(chatId, `📅 *Agendamento confirmado!* 
👤 Nome: ${cliente.nomeCliente} 
📞 Telefone: ${cliente.telefoneCliente}
🚘 Placa: ${cliente.placa} 
🚗 Ano: ${cliente.ano} 
📅 Data: ${cliente.dataAgendamento} 
⏰ Horário: ${cliente.horarioAgendamento}

Digite *menu* para voltar.`);
        clientes.delete(chatId);
    }

    // Falar com atendente
    else if (mensagem === "3" && cliente.etapa === "") {
        client.sendMessage(chatId, "🔗 Você será direcionado para um atendente. Aguarde...");
    }
});

client.initialize();
