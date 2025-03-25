const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const db = require('../config/db');

// Cadastro de professor
router.post('/', [
    body('user_id').isInt()
], async (req, res) => {
    const { user_id } = req.body;
    try {
        const result = await db.query('INSERT INTO Professores (user_id) VALUES (?)', [user_id]);
        res.status(201).json({ message: 'Professor cadastrado', professor_id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cadastrar professor', error: err });
    }
});

// Listar professores
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Professores.*, Users.name, Users.email 
            FROM Professores 
            INNER JOIN Users ON Professores.user_id = Users.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar professores', error: err });
    }
});

module.exports = router;
