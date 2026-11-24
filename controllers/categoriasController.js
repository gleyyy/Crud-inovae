
const Categoria = require('../models/Categoria');

async function listar(req, res) {

    try {

        const categorias = await Categoria.listar();

        res.status(200).json({

            categorias

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: 'Erro ao carregar categorias'

        });

    }

}

module.exports = { listar };
