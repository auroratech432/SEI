const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Cadastro de aluno
router.post('/', [
    body('user_id').isInt(),
    body('matricula').notEmpty(),
    body('turma_id').isInt()
], async (req, res) => {
    const { user_id, matricula, turma_id } = req.body;

    try {
        const result = await db.query('INSERT INTO Alunos (user_id, matricula, turma_id) VALUES (?, ?, ?)', [user_id, matricula, turma_id]);
        res.status(201).json({ message: 'Aluno cadastrado', aluno_id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cadastrar aluno', error: err });
    }
});

// Listar alunos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Alunos.*, Users.name, Users.email 
            FROM Alunos 
            INNER JOIN Users ON Alunos.user_id = Users.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar alunos', error: err });
    }
});

module.exports = router;
