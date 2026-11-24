
const jwt = require('jsonwebtoken');


// =========================================
// VERIFICAR AUTENTICAÇÃO
// =========================================

function verificarToken(req, res, next) {

    const autorizacao = req.headers.authorization;

    if (!autorizacao) {

        return res.status(401).json({

            erro: 'Token de autenticação não informado'

        });

    }


    const partes = autorizacao.split(' ');

    if (
        partes.length !== 2 ||
        partes[0] !== 'Bearer' ||
        !partes[1]
    ) {

        return res.status(401).json({

            erro: 'Formato de token inválido'

        });

    }


    const token = partes[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = {

            id: decoded.id,
            tipo: decoded.tipo

        };

        next();

    } catch (error) {

        return res.status(401).json({

            erro: 'Token inválido ou expirado'

        });

    }

}


// =========================================
// VERIFICAR SE É ADMINISTRADOR
// =========================================

function verificarAdmin(req, res, next) {

    if (!req.usuario || req.usuario.tipo !== 'admin') {

        return res.status(403).json({

            erro: 'Acesso permitido somente para administradores'

        });

    }

    next();

}


module.exports = {

    verificarToken,
    verificarAdmin

};
