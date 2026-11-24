
const Produto = require('../models/Produto');


// =========================================
// LISTAR PRODUTOS
// GET /api/produtos
// =========================================

async function listar(req, res) {

    try {

        const filtros = {

            categoria: req.query.categoria,

            busca: req.query.busca

        };

        const produtos = await Produto.listar(filtros);

        return res.status(200).json({

            quantidade: produtos.length,

            produtos

        });

    } catch (error) {

        console.error('Erro ao listar produtos:', error);

        return res.status(500).json({

            erro: 'Não foi possível carregar os produtos'

        });

    }

}


// =========================================
// BUSCAR PRODUTO POR ID
// GET /api/produtos/:id
// =========================================

async function buscarPorId(req, res) {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({

                erro: 'Identificador inválido'

            });

        }

        const produto = await Produto.buscarPorId(id);

        if (!produto || !produto.ativo) {

            return res.status(404).json({

                erro: 'Produto não encontrado'

            });

        }

        return res.status(200).json({

            produto

        });

    } catch (error) {

        console.error('Erro ao buscar produto:', error);

        return res.status(500).json({

            erro: 'Não foi possível consultar o produto'

        });

    }

}


// =========================================
// CADASTRAR PRODUTO
// POST /api/produtos
// =========================================

async function cadastrar(req, res) {

    try {

        const {

            id_categoria,
            nome,
            descricao,
            tamanho,
            cor,
            valor_diaria,
            quantidade_estoque,
            imagem_url

        } = req.body;


        if (
            !nome ||
            !nome.trim() ||
            !id_categoria ||
            valor_diaria === undefined ||
            quantidade_estoque === undefined
        ) {

            return res.status(400).json({

                erro: 'Preencha os campos obrigatórios'

            });

        }


        const categoria = Number(id_categoria);

        const preco = Number(valor_diaria);

        const estoque = Number(quantidade_estoque);


        if (
            !Number.isInteger(categoria) ||
            categoria <= 0
        ) {

            return res.status(400).json({

                erro: 'Categoria inválida'

            });

        }


        if (!Number.isFinite(preco) || preco < 0) {

            return res.status(400).json({

                erro: 'Valor da diária inválido'

            });

        }


        if (!Number.isInteger(estoque) || estoque < 0) {

            return res.status(400).json({

                erro: 'Quantidade em estoque inválida'

            });

        }


        if (nome.trim().length > 120) {

            return res.status(400).json({

                erro: 'Nome muito longo'

            });

        }


        const urlValida = (url) => {

            if (!url) return true;

            try {

                const parsed = new URL(url);

                return (
                    parsed.protocol === 'http:' ||
                    parsed.protocol === 'https:'
                );

            } catch {

                return false;

            }

        };


        if (!urlValida(imagem_url)) {

            return res.status(400).json({

                erro: 'Informe uma URL de imagem válida'

            });

        }


        const idProduto = await Produto.cadastrar({

            id_categoria: categoria,

            nome: nome.trim(),

            descricao,

            tamanho,

            cor,

            valor_diaria: preco,

            quantidade_estoque: estoque,

            imagem_url

        });


        const produto = await Produto.buscarPorId(idProduto);


        return res.status(201).json({

            mensagem: 'Produto cadastrado com sucesso!',

            produto

        });


    } catch (error) {

        console.error('Erro ao cadastrar produto:', error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {

            return res.status(400).json({

                erro: 'A categoria informada não existe'

            });

        }

        return res.status(500).json({

            erro: 'Não foi possível cadastrar o produto'

        });

    }

}


// =========================================
// ATUALIZAR PRODUTO
// PUT /api/produtos/:id
// =========================================

async function atualizar(req, res) {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({

                erro: 'Identificador inválido'

            });

        }


        const {

            id_categoria,
            nome,
            descricao,
            tamanho,
            cor,
            valor_diaria,
            quantidade_estoque,
            imagem_url

        } = req.body;


        if (
            !nome ||
            !nome.trim() ||
            !id_categoria ||
            valor_diaria === undefined ||
            quantidade_estoque === undefined
        ) {

            return res.status(400).json({

                erro: 'Preencha os campos obrigatórios'

            });

        }


        const categoria = Number(id_categoria);

        const preco = Number(valor_diaria);

        const estoque = Number(quantidade_estoque);


        if (
            !Number.isInteger(categoria) ||
            categoria <= 0 ||
            !Number.isFinite(preco) ||
            preco < 0 ||
            !Number.isInteger(estoque) ||
            estoque < 0
        ) {

            return res.status(400).json({

                erro: 'Verifique categoria, preço e estoque'

            });

        }


        if (nome.trim().length > 120) {

            return res.status(400).json({

                erro: 'Nome muito longo'

            });

        }


        if (imagem_url) {

            try {

                const parsed = new URL(imagem_url);

                if (
                    parsed.protocol !== 'http:' &&
                    parsed.protocol !== 'https:'
                ) {

                    throw new Error('URL inválida');

                }

            } catch {

                return res.status(400).json({

                    erro: 'Informe uma URL de imagem válida'

                });

            }

        }


        const alterados = await Produto.atualizar(id, {

            id_categoria: categoria,

            nome: nome.trim(),

            descricao,

            tamanho,

            cor,

            valor_diaria: preco,

            quantidade_estoque: estoque,

            imagem_url

        });


        if (!alterados) {

            const existente = await Produto.buscarPorId(id);

            if (!existente || !existente.ativo) {

                return res.status(404).json({

                    erro: 'Produto não encontrado'

                });

            }

            return res.status(200).json({

                mensagem: 'Nenhuma alteração necessária',

                produto: existente

            });

        }


        const produtoAtualizado = await Produto.buscarPorId(id);


        return res.status(200).json({

            mensagem: 'Produto atualizado com sucesso!',

            produto: produtoAtualizado

        });


    } catch (error) {

        console.error('Erro ao atualizar produto:', error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {

            return res.status(400).json({

                erro: 'A categoria informada não existe'

            });

        }

        return res.status(500).json({

            erro: 'Não foi possível atualizar o produto'

        });

    }

}


// =========================================
// DESATIVAR PRODUTO
// DELETE /api/produtos/:id
// =========================================

async function desativar(req, res) {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({

                erro: 'Identificador inválido'

            });

        }


        const alterados = await Produto.desativar(id);

        if (!alterados) {

            return res.status(404).json({

                erro: 'Produto não encontrado ou já desativado'

            });

        }


        return res.status(200).json({

            mensagem: 'Produto desativado com sucesso!'

        });


    } catch (error) {

        console.error('Erro ao desativar produto:', error);

        return res.status(500).json({

            erro: 'Não foi possível desativar o produto'

        });

    }

}


module.exports = {

    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    desativar

};
