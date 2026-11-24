
const conn = require('../config/database');


// =========================================
// BUSCAR USUÁRIO PELO E-MAIL
// =========================================

function buscarPorEmail(email) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
        `;

        conn.query(sql, [email], (err, results) => {

            if (err) {
                return reject(err);
            }

            resolve(results[0] || null);

        });

    });

}


// =========================================
// BUSCAR USUÁRIO PELO ID
// =========================================

function buscarPorId(id) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                id_usuario,
                nome,
                email,
                telefone,
                tipo,
                criado_em
            FROM usuarios
            WHERE id_usuario = ?
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
// CADASTRAR USUÁRIO
// =========================================

function cadastrar(dados) {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha_hash, telefone)
            VALUES (?, ?, ?, ?)
        `;

        conn.query(

            sql,

            [
                dados.nome,
                dados.email,
                dados.senha_hash,
                dados.telefone || null
            ],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result.insertId);

            }

        );

    });

}


// =========================================
// ATUALIZAR USUÁRIO
// =========================================

function atualizar(id, dados) {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE usuarios
            SET nome = ?,
                email = ?,
                telefone = ?
            WHERE id_usuario = ?
        `;

        conn.query(

            sql,

            [
                dados.nome,
                dados.email,
                dados.telefone || null,
                id
            ],

            (err, result) => {

                if (err) {
                    return reject(err);
                }

                resolve(result.affectedRows);

            }

        );

    });

}


module.exports = {

    buscarPorEmail,
    buscarPorId,
    cadastrar,
    atualizar

};
