
const conn = require('../config/database');

function listar() {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM categorias
            ORDER BY nome ASC
        `;

        conn.query(sql, (err, resultados) => {

            if (err) return reject(err);

            resolve(resultados);

        });

    });

}

module.exports = { listar };
