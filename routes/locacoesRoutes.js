
const express = require('express');

const router = express.Router();

const locacoesController = require('../controllers/locacoesController');

const { verificarToken } = require('../middleware/auth');


// Todas as rotas exigem login

router.use(verificarToken);


// Criar locação

router.post(
    '/',
    locacoesController.criar
);


// Consultar histórico

router.get(
    '/',
    locacoesController.listar
);


module.exports = router;
