const db = require('../config/db');

exports.cadastrarCuidador = async (req, res) => {
    const { nome, email, telefone, especialidade } = req.body;

    try {
        const query = 'INSERT INTO cuidadores (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [nome, email, telefone, especialidade]);
        
        res.status(201).json({ message: 'Cuidador cadastrado!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};