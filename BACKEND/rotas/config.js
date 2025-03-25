require('dotenv').config();

module.exports = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'gestao_escolar'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'chavesecreta123',
        expiresIn: process.env.JWT_EXPIRE_TIME || '1h'
    }
};
