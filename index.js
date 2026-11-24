
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const conn = require('./config/database');

// =========================================
// MIDDLEWARES
// =========================================

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================
// ROTA PRINCIPAL
// =========================================

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API da Locadora funcionando!',
        sistema: 'Locadora de Roupas e Acessórios',
        status: 'online'
    });
});

// =========================================
// ROTA DE VERIFICAÇÃO
// =========================================

app.get('/api/status', (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({
                status: 'erro',
                mensagem: 'Banco de dados indisponível'
            });
        }

        connection.ping((pingError) => {
            connection.release();

            if (pingError) {
                return res.status(500).json({
                    status: 'erro',
                    mensagem: 'Não foi possível verificar o banco de dados'
                });
            }

            res.status(200).json({
                status: 'online',
                banco: 'conectado',
                mensagem: 'Sistema funcionando corretamente'
            });
        });
    });
});

// =========================================
// ROTAS DO SISTEMA
// =========================================

const usuariosRoutes = require('./routes/usuariosRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const locacoesRoutes = require('./routes/locacoesRoutes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/locacoes', locacoesRoutes);

// =========================================
// TRATAMENTO DE ROTAS INEXISTENTES
// =========================================

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada'
    });
});

// =========================================
// TRATAMENTO DE ERROS
// =========================================

app.use((err, req, res, next) => {
    console.error('Erro na API:', err);

    res.status(500).json({
        erro: 'Erro interno do servidor'
    });
});

// =========================================
// INICIALIZAÇÃO DO SERVIDOR
// =========================================

const PORT = process.env.PORT || 3000;

conn.getConnection((err, connection) => {
    if (err) {
        console.error('Não foi possível conectar ao MySQL:', err.message);
        return;
    }

    console.log('Banco de dados conectado com sucesso!');
    connection.release();

    app.listen(PORT, () => {
        console.log('=================================');
        console.log('LOCADORA DE ROUPAS E ACESSÓRIOS');
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`http://localhost:${PORT}`);
        console.log('=================================');
    });
});
