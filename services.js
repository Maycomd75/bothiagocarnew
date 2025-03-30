const { connectDB } = require('./db');

async function salvarOrcamento(dados) {
    try {
        if (!dados.nome || !dados.placa || !dados.modelo || !dados.ano || !dados.servicos) {
            throw new Error("Preencha todos os campos obrigatórios.");
        }

        const db = await connectDB();
        const orcamentos = db.collection("orcamentos");

        const valorTotal = calcularPreco(dados.modelo, dados.servicos);
        const orcamento = { ...dados, valorTotal };

        await orcamentos.insertOne(orcamento);
        return orcamento;
    } catch (error) {
        console.error("Erro ao salvar orçamento:", error.message);
        throw new Error("Erro ao salvar orçamento.");
    }
}

async function salvarAgendamento(dados) {
    try {
        if (!dados.nome || !dados.telefone || !dados.placa || !dados.modelo || !dados.ano || !dados.data || !dados.horario) {
            throw new Error("Preencha todos os campos obrigatórios.");
        }

        const db = await connectDB();
        const agendamentos = db.collection("agendamentos");

        await agendamentos.insertOne(dados);
        return dados;
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error.message);
        throw new Error("Erro ao salvar agendamento.");
    }
}

function calcularPreco(modelo, servicos) {
    const precosBase = { 'gol': 200, 'fiesta': 250, 'default': 300 };
    const precosServicos = { 'troca de óleo': 50, 'alinhamento': 80, 'balanceamento': 60 };

    let precoTotal = precosBase[modelo.toLowerCase()] || precosBase['default'];

    servicos.split(',').forEach(servico => {
        precoTotal += precosServicos[servico.trim().toLowerCase()] || 0;
    });

    return precoTotal;
}

module.exports = { salvarOrcamento, salvarAgendamento };