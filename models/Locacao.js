
const conn = require('../config/database');


// =========================================
// CRIAR LOCAÇÃO
// =========================================

function criar(idUsuario, dataInicio, dataFim, itens) {

    return new Promise((resolve, reject) => {

        conn.getConnection((err, connection) => {

            if (err) return reject(err);

            connection.beginTransaction(async (err) => {

                if (err) {

                    connection.release();

                    return reject(err);

                }

                try {

                    const consultar = (sql, valores) => {

                        return new Promise((resolveQuery, rejectQuery) => {

                            connection.query(sql, valores, (err, resultado) => {

                                if (err) return rejectQuery(err);

                                resolveQuery(resultado);

                            });

                        });

                    };


                    let valorTotal = 0;

                    const produtos = [];


                    // CALCULAR QUANTIDADE DE DIAS

                    const resultadoDias = await consultar(

                        'SELECT DATEDIFF(?, ?) + 1 AS dias',

                        [dataFim, dataInicio]

                    );

                    const dias = resultadoDias[0].dias;


                    // VERIFICAR CADA PRODUTO

                    for (const item of itens) {

                        const resultadoProduto = await consultar(

                            `SELECT *
                             FROM produtos
                             WHERE id_produto = ?
                             AND ativo = TRUE
                             FOR UPDATE`,

                            [item.id_produto]

                        );


                        if (resultadoProduto.length === 0) {

                            throw new Error('Produto não encontrado');

                        }


                        const produto = resultadoProduto[0];


                        // CONSULTAR RESERVAS NO MESMO PERÍODO

                        const resultadoReserva = await consultar(

                            `SELECT COALESCE(SUM(il.quantidade), 0) AS reservado
                             FROM itens_locacao il
                             INNER JOIN locacoes l
                             ON il.id_locacao = l.id_locacao
                             WHERE il.id_produto = ?
                             AND l.status IN (
                                'pendente',
                                'confirmada',
                                'em_andamento'
                             )
                             AND l.data_inicio <= ?
                             AND l.data_fim >= ?`,

                            [
                                item.id_produto,
                                dataFim,
                                dataInicio
                            ]

                        );


                        const reservado = Number(
                            resultadoReserva[0].reservado
                        );


                        const disponivel =
                            produto.quantidade_estoque - reservado;


                        if (item.quantidade > disponivel) {

                            throw new Error(
                                `Estoque insuficiente para ${produto.nome}`
                            );

                        }


                        const subtotal =
                            Number(produto.valor_diaria) *
                            item.quantidade *
                            dias;


                        valorTotal += subtotal;


                        produtos.push({

                            id_produto: produto.id_produto,

                            quantidade: item.quantidade,

                            valor_diaria: produto.valor_diaria

                        });

                    }


                    // CADASTRAR LOCAÇÃO

                    const resultadoLocacao = await consultar(

                        `INSERT INTO locacoes
                        (id_usuario, data_inicio, data_fim, status, valor_total)
                        VALUES (?, ?, ?, 'pendente', ?)`,

                        [
                            idUsuario,
                            dataInicio,
                            dataFim,
                            valorTotal
                        ]

                    );


                    const idLocacao = resultadoLocacao.insertId;


                    // CADASTRAR PRODUTOS DA LOCAÇÃO

                    for (const item of produtos) {

                        await consultar(

                            `INSERT INTO itens_locacao
                            (id_locacao, id_produto, quantidade, valor_diaria)
                            VALUES (?, ?, ?, ?)`,

                            [
                                idLocacao,
                                item.id_produto,
                                item.quantidade,
                                item.valor_diaria
                            ]

                        );

                    }


                    connection.commit((err) => {

                        if (err) {

                            return connection.rollback(() => {

                                connection.release();

                                reject(err);

                            });

                        }


                        connection.release();

                        resolve({

                            id_locacao: idLocacao,

                            dias,

                            valor_total: Number(valorTotal.toFixed(2)),

                            status: 'pendente'

                        });

                    });


                } catch (error) {

                    connection.rollback(() => {

                        connection.release();

                        reject(error);

                    });

                }

            });

        });

    });

}


// =========================================
// LISTAR LOCAÇÕES DO CLIENTE
// =========================================

function listarPorUsuario(idUsuario) {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT
                l.id_locacao,
                l.data_inicio,
                l.data_fim,
                l.status,
                l.valor_total,
                l.criado_em

            FROM locacoes l

            WHERE l.id_usuario = ?

            ORDER BY l.criado_em DESC

        `;


        conn.query(sql, [idUsuario], (err, resultados) => {

            if (err) return reject(err);

            resolve(resultados);

        });

    });

}


module.exports = {

    criar,
    listarPorUsuario

};
