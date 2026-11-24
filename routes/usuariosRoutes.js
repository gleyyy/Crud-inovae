
const express = require('express');

const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

const { verificarToken } = require('../middleware/auth');


// =========================================
// ROTAS PÚBLICAS
// Não exigem autenticação
// =========================================

// Cadastro
router.post(
    '/cadastro',
    usuariosController.cadastrar
);


// Login
router.post(
    '/login',
    usuariosController.login
);


// =========================================
// ROTAS PRIVADAS
// Exigem token JWT
// =========================================

// Consultar perfil
router.get(
    '/perfil',
    verificarToken,
    usuariosController.consultarPerfil
);


// Atualizar perfil
router.put(
    '/perfil',
    verificarToken,
    usuariosController.atualizarPerfil
);


module.exports = router;
