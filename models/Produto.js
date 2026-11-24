
const conn = require('../config/database');


// =========================================
// LISTAR PRODUTOS
// =========================================

function listar(filtros = {}) {

    return new Promise((resolve, reject) => {

        let sql = `
            SELECT
                p.id_produto,
                p.nome,
                p.descricao,
                p.tamanho,
                p.cor,
                p.valor_diaria,
                p.quantidade_estoque,
                p.imagem_url,
                p.ativo,
                c.id_categoria,
                c.nome AS categoria
            FROM produtos p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            WHERE p.ativo = TRUE
        `;

        const valores = [];

        if (filtros.categoria) {

            sql += ' AND c.nome = ?';

            valores.push(filtros.categoria);

        }

        if (filtros.busca) {

            sql += ' AND (p.nome LIKE ? OR p.descricao LIKE ?)';

            const busca = `%${filtros.busca}%`;

            valores.push(busca, busca);

        }

        sql += ' ORDER BY p.criado_em DESC';


        conn.query(sql, valores, (err, results) => {

            if (err) {
                return reject(err);
            }

            resolve(results);

        });

    });

}


// =========================================
// BUSCAR PRODUTO POR ID
// =========================================

function buscarPorId(id) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                p.*,
                c.nome AS categoria
            FROM produtos p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            WHERE p.id_produto = ?
        `;

        conn.query(sql, [id], (err, results) => {

            if (err) {
                return reject(err);
            }

            resolve(results[0] || null);

        });

    });

}


// =========================================
// CADASTRAR PRODUTO
// =========================================

function cadastrar(produto) {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO produtos (
                id_categoria,
                nome,
                descricao,
                tamanho,
                cor,
                valor_diaria,
                quantidade_estoque,
                imagem_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [

            produto.id_categoria,
            produto.nome,
            produto.descricao || null,
            produto.tamanho || null,
            produto.cor || null,
            produto.valor_diaria,
            produto.quantidade_estoque,
            produto.imagem_url || null

        ];

        conn.query(sql, valores, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result.insertId);

        });

    });

}


// =========================================
// ATUALIZAR PRODUTO
// =========================================

function atualizar(id, produto) {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE produtos
            SET
                id_categoria = ?,
                nome = ?,
                descricao = ?,
                tamanho = ?,
                cor = ?,
                valor_diaria = ?,
                quantidade_estoque = ?,
                imagem_url = ?
            WHERE id_produto = ?
                AND ativo = TRUE
        `;

        const valores = [

            produto.id_categoria,
            produto.nome,
            produto.descricao || null,
            produto.tamanho || null,
            produto.cor || null,
            produto.valor_diaria,
            produto.quantidade_estoque,
            produto.imagem_url || null,
            id

        ];

        conn.query(sql, valores, (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result.affectedRows);

        });

    });

}


// =========================================
// DESATIVAR PRODUTO
// =========================================

function desativar(id) {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE produtos
            SET ativo = FALSE
            WHERE id_produto = ?
                AND ativo = TRUE
        `;

        conn.query(sql, [id], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result.affectedRows);

        });

    });

}


module.exports = {

    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    desativar

};
