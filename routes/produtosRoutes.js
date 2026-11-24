
const express = require('express');

const router = express.Router();

const produtosController = require('../controllers/produtosController');

const {
    verificarToken,
    verificarAdmin
} = require('../middleware/auth');


// =========================================
// ROTAS PÚBLICAS
// =========================================

// Listar produtos
router.get(
    '/',
    produtosController.listar
);


// Consultar produto individual
router.get(
    '/:id',
    produtosController.buscarPorId
);


// =========================================
// ROTAS ADMINISTRATIVAS
// =========================================

// Cadastrar produto
router.post(
    '/',
    verificarToken,
    verificarAdmin,
    produtosController.cadastrar
);


// Atualizar produto
router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    produtosController.atualizar
);


// Desativar produto
router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    produtosController.desativar
);


module.exports = router;
