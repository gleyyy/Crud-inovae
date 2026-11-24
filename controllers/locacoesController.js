
const Locacao = require('../models/Locacao');


// =========================================
// VALIDAR DATA
// =========================================

function dataValida(data) {

    if (
        typeof data !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {

        return false;

    }

    const dataObjeto = new Date(`${data}T00:00:00Z`);

    return (
        !Number.isNaN(dataObjeto.getTime()) &&
        dataObjeto.toISOString().slice(0, 10) === data
    );

}


// =========================================
// CRIAR LOCAÇÃO
// POST /api/locacoes
// =========================================

async function criar(req, res) {

    try {

        const {
            data_inicio,
            data_fim,
            itens
        } = req.body;


        if (
            !dataValida(data_inicio) ||
            !dataValida(data_fim)
        ) {

            return res.status(400).json({

                erro: 'Informe datas válidas'

            });

        }


        const hoje = new Intl.DateTimeFormat('en-CA', {

            timeZone: 'America/Recife',

            year: 'numeric',

            month: '2-digit',

            day: '2-digit'

        }).format(new Date());


        if (data_inicio < hoje || data_fim < data_inicio) {

            return res.status(400).json({

                erro: 'Verifique as datas da locação'

            });

        }


        if (
            !Array.isArray(itens) ||
            itens.length === 0 ||
            itens.length > 20
        ) {

            return res.status(400).json({

                erro: 'O carrinho está vazio ou possui itens demais'

            });

        }


        const ids = new Set();


        for (const item of itens) {

            if (
                !Number.isInteger(item.id_produto) ||
                item.id_produto <= 0 ||
                !Number.isInteger(item.quantidade) ||
                item.quantidade <= 0 ||
                ids.has(item.id_produto)
            ) {

                return res.status(400).json({

                    erro: 'Verifique os produtos e quantidades'

                });

            }

            ids.add(item.id_produto);

        }


        const locacao = await Locacao.criar(

            req.usuario.id,

            data_inicio,

            data_fim,

            itens

        );


        return res.status(201).json({

            mensagem: 'Locação solicitada com sucesso!',

            locacao

        });


    } catch (error) {

        console.error(error);

        if (
            error.message.includes('Estoque insuficiente') ||
            error.message.includes('Produto não encontrado')
        ) {

            return res.status(409).json({

                erro: error.message

            });

        }


        return res.status(500).json({

            erro: 'Erro ao realizar locação'

        });

    }

}


// =========================================
// HISTÓRICO DE LOCAÇÕES
// GET /api/locacoes
// =========================================

async function listar(req, res) {

    try {

        const locacoes = await Locacao.listarPorUsuario(
            req.usuario.id
        );


        return res.status(200).json({

            quantidade: locacoes.length,

            locacoes

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            erro: 'Erro ao consultar locações'

        });

    }

}


module.exports = {

    criar,
    listar

};
