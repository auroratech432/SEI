const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Cadastro de usuário
router.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['diretor', 'professor', 'aluno'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    try {
        const result = await db.query('INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, password_hash, role]);
        res.status(201).json({ message: 'Usuário criado com sucesso!', user_id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: err });
    }
});

// Login de usuário
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ message: 'Senha incorreta' });

        // Simples 
        res.json({ message: 'Login realizado', user });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login', error: err });
    }
});

module.exports = router;
