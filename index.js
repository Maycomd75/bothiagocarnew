const fs = require("fs");
const path = require("path");

// Caminhos para os arquivos JSON
const orcamentosFilePath = path.join(__dirname, "orcamentos.json");
const agendamentosFilePath = path.join(__dirname, "agendamentos.json");

// Função para salvar um orçamento
const salvarOrcamento = async (nomeCliente, placa, modelo, ano, servicosSelecionados, total) => {
    const orcamento = {
        nomeCliente,
        placa,
        modelo,
        ano,
        servicos: servicosSelecionados,
        total
    };

    // Ler o arquivo de orçamentos
    const orcamentos = JSON.parse(fs.readFileSync(orcamentosFilePath, "utf-8"));

    // Adicionar o novo orçamento
    orcamentos.push(orcamento);

    // Salvar o arquivo atualizado
    fs.writeFileSync(orcamentosFilePath, JSON.stringify(orcamentos, null, 2));

    console.log("Orçamento salvo com sucesso!");
};

// Função para salvar um agendamento
const salvarAgendamento = async (nomeCliente, placa, modelo, ano, dataAgendamento, horarioAgendamento,) => {
    const agendamento = {
        nomeCliente,
        placa,
        modelo,
        ano,
        dataAgendamento,
        horarioAgendamento,
    };

    // Ler o arquivo de agendamentos
    const agendamentos = JSON.parse(fs.readFileSync(agendamentosFilePath, "utf-8"));

    // Adicionar o novo agendamento
    agendamentos.push(agendamento);

    // Salvar o arquivo atualizado
    fs.writeFileSync(agendamentosFilePath, JSON.stringify(agendamentos, null, 2));

    console.log("Agendamento salvo com sucesso!");
};

module.exports = {
    salvarOrcamento,
    salvarAgendamento
};