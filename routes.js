const { connectDB } = require('./db');
const Agendamento = require('./models/agendamento');
const Orcamento = require('./models/orcamento');
const router = express.Router();


// Obter todos os orçamentos
router.get('/orcamentos', async (req, res) => {
    try {
        const db = await connectDB();
        const orcamentos = await db.collection("orcamentos")
            .find({}, { projection: { _id: 0 } }) // Evita retornar o _id desnecessário
            .toArray();
        res.json(orcamentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar orçamentos' });
    }
});

// Adicionar um novo orçamento
router.post('/orcamentos', async (req, res) => {
    try {
        const { nome, placa, modelo, ano, servicos, valorTotal } = req.body;

        if (!nome || !placa || !modelo || !ano || !servicos || !valorTotal) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const db = await connectDB();
        await db.collection("orcamentos").insertOne({ nome, placa, modelo, ano, servicos, valorTotal });

        res.status(201).json({ message: 'Orçamento salvo com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar orçamento' });
    }
});

// Obter todos os agendamentos
router.get('/agendamentos', async (req, res) => {
    try {
        const db = await connectDB();
        const agendamentos = await db.collection("agendamentos")
            .find({}, { projection: { _id: 0 } }) 
            .toArray();
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
});

// Adicionar um novo agendamento
router.post('/agendamentos', async (req, res) => {
    try {
        const { nome, telefone, placa, modelo, ano, data, horario } = req.body;

        if (!nome || !telefone || !placa || !modelo || !ano || !data || !horario) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const db = await connectDB();
        await db.collection("agendamentos").insertOne({ nome, telefone, placa, modelo, ano, data, horario });

        res.status(201).json({ message: 'Agendamento salvo com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar agendamento' });
    }
});

// Rota para obter agendamentos
router.get('/api/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find();
        res.json(agendamentos); // Envia a lista de agendamentos como resposta
    } catch (err) {
        res.status(500).send('Erro ao carregar agendamentos');
    }
});

// Rota para criar agendamento
router.post('/api/agendamentos', async (req, res) => {
    try {
        const { nome_cliente, data, hora } = req.body;
        const agendamento = new Agendamento({ nome_cliente, data, hora });
        await agendamento.save();
        res.json(agendamento); // Retorna o agendamento criado
    } catch (err) {
        res.status(500).send('Erro ao criar agendamento');
    }
});

// Rota para obter orçamentos
router.get('/api/orcamentos', async (req, res) => {
    try {
        const orcamentos = await Orcamento.find();
        res.json(orcamentos);
    } catch (err) {
        res.status(500).send('Erro ao carregar orçamentos');
    }
});

// Rota para criar orçamento
router.post('/api/orcamentos', async (req, res) => {
    try {
        const { nome_cliente_orcamento, valor, descricao } = req.body;
        const orcamento = new Orcamento({ nome_cliente_orcamento, valor, descricao });
        await orcamento.save();
        res.json(orcamento);
    } catch (err) {
        res.status(500).send('Erro ao criar orçamento');
    }
});

module.exports = router;
