const db = require('../config/db');

exports.cadastrarCuidador = async (req, res) => {
    // Pegamos os dados que vem do corpo (body) da requisição
    const { nome, CPF, telefone, especialidade } = req.body;

    try {
        const query = 'INSERT INTO cuidadores (nome, CPF, telefone, especialidade) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [nome, CPF, telefone, especialidade]);
        
        // Retornamos status 201 (Criado com sucesso)
        res.status(201).json({ message: 'Cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao salvar no banco de dados' });
    }
};