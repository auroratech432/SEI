// routes/faltas.js
// Arquivo para os professores poderem lançar as faltas dos alunos

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Rota para lançamento de faltas
router.post('/', [
    body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
    body('turma_id').isInt().withMessage('O ID da turma deve ser um número inteiro.'),
    body('data').isISO8601().withMessage('Data inválida.'),
    body('justificativa').optional().isString().withMessage('A justificativa deve ser um texto.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { aluno_id, turma_id, data, justificativa } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO Faltas (aluno_id, turma_id, data, justificativa) VALUES (?, ?, ?, ?)',
            [aluno_id, turma_id, data, justificativa || null]
        );
        res.status(201).json({ message: 'Falta registrada com sucesso!', falta_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar falta' });
    }
});

module.exports = router;