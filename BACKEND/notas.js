// routes/notas.js
// Arquivo para os professores poderem lançar as notas dos alunos, permite selecionar, trabalho, teste ou prova

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Rota para lançamento de notas
router.post('/', [
    body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
    body('materia_id').isInt().withMessage('O ID da matéria deve ser um número inteiro.'),
    body('nota').isFloat({ min: 0, max: 10 }).withMessage('A nota deve estar entre 0 e 10.'),
    body('tipo_atividade').isIn(['trabalho', 'prova', 'teste']).withMessage('Tipo de atividade inválido.'),
    body('data').isISO8601().withMessage('Data inválida.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { aluno_id, materia_id, nota, tipo_atividade, data } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO Notas (aluno_id, materia_id, nota, tipo_atividade, data) VALUES (?, ?, ?, ?, ?)',
            [aluno_id, materia_id, nota, tipo_atividade, data]
        );
        res.status(201).json({ message: 'Nota lançada com sucesso!', nota_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao lançar nota' });
    }
});

module.exports = router;