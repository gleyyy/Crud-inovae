
const Usuario = require('../models/Usuario');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// =========================================
// GERAR TOKEN JWT
// =========================================

function gerarToken(usuario) {

    return jwt.sign(

        {
            id: usuario.id_usuario,
            tipo: usuario.tipo
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }

    );

}


// =========================================
// CADASTRAR USUÁRIO
// POST /api/usuarios/cadastro
// =========================================

async function cadastrar(req, res) {

    try {

        const { nome, email, senha, telefone } = req.body;


        // VALIDAÇÃO DOS CAMPOS

        if (
            !nome ||
            !email ||
            !senha ||
            !nome.trim() ||
            !email.trim() ||
            !senha.trim()
        ) {

            return res.status(400).json({

                erro: 'Nome, e-mail e senha são obrigatórios'

            });

        }


        const nomeLimpo = nome.trim();

        const emailLimpo = email.trim().toLowerCase();


        if (nomeLimpo.length > 120) {

            return res.status(400).json({

                erro: 'O nome deve ter no máximo 120 caracteres'

            });

        }


        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            emailLimpo.length > 150 ||
            !emailValido.test(emailLimpo)
        ) {

            return res.status(400).json({

                erro: 'Informe um endereço de e-mail válido'

            });

        }


        if (senha.length < 8) {

            return res.status(400).json({

                erro: 'A senha deve possuir pelo menos 8 caracteres'

            });

        }


        if (telefone && telefone.length > 20) {

            return res.status(400).json({

                erro: 'O telefone deve ter no máximo 20 caracteres'

            });

        }


        // VERIFICAR SE O E-MAIL JÁ EXISTE

        const usuarioExistente = await Usuario.buscarPorEmail(emailLimpo);

        if (usuarioExistente) {

            return res.status(409).json({

                erro: 'Este e-mail já está cadastrado'

            });

        }


        // CRIPTOGRAFAR SENHA

        const senhaHash = await bcrypt.hash(senha, 12);


        // CADASTRAR NO BANCO

        const idUsuario = await Usuario.cadastrar({

            nome: nomeLimpo,

            email: emailLimpo,

            senha_hash: senhaHash,

            telefone

        });


        const usuario = await Usuario.buscarPorId(idUsuario);

        const token = gerarToken(usuario);


        return res.status(201).json({

            mensagem: 'Cadastro realizado com sucesso!',

            token,

            usuario

        });


    } catch (error) {

        console.error('Erro no cadastro:', error);

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({

                erro: 'Este e-mail já está cadastrado'

            });

        }

        return res.status(500).json({

            erro: 'Não foi possível realizar o cadastro'

        });

    }

}


// =========================================
// REALIZAR LOGIN
// POST /api/usuarios/login
// =========================================

async function login(req, res) {

    try {

        const { email, senha } = req.body;


        if (
            !email ||
            !senha ||
            !email.trim() ||
            !senha.trim()
        ) {

            return res.status(400).json({

                erro: 'Informe seu e-mail e sua senha'

            });

        }


        const emailLimpo = email.trim().toLowerCase();


        // BUSCAR USUÁRIO

        const usuario = await Usuario.buscarPorEmail(emailLimpo);

        if (!usuario) {

            return res.status(401).json({

                erro: 'E-mail ou senha incorretos'

            });

        }


        // COMPARAR SENHAS

        const senhaCorreta = await bcrypt.compare(

            senha,

            usuario.senha_hash

        );


        if (!senhaCorreta) {

            return res.status(401).json({

                erro: 'E-mail ou senha incorretos'

            });

        }


        // GERAR TOKEN

        const token = gerarToken(usuario);


        // REMOVER SENHA DA RESPOSTA

        const dadosUsuario = await Usuario.buscarPorId(
            usuario.id_usuario
        );


        return res.status(200).json({

            mensagem: 'Login realizado com sucesso!',

            token,

            usuario: dadosUsuario

        });


    } catch (error) {

        console.error('Erro no login:', error);

        return res.status(500).json({

            erro: 'Não foi possível realizar o login'

        });

    }

}


// =========================================
// CONSULTAR PERFIL
// GET /api/usuarios/perfil
// =========================================

async function consultarPerfil(req, res) {

    try {

        const usuario = await Usuario.buscarPorId(
            req.usuario.id
        );


        if (!usuario) {

            return res.status(404).json({

                erro: 'Usuário não encontrado'

            });

        }


        return res.status(200).json({

            usuario

        });


    } catch (error) {

        console.error('Erro ao consultar perfil:', error);

        return res.status(500).json({

            erro: 'Não foi possível consultar o perfil'

        });

    }

}


// =========================================
// ATUALIZAR PERFIL
// PUT /api/usuarios/perfil
// =========================================

async function atualizarPerfil(req, res) {

    try {

        const { nome, email, telefone } = req.body;


        if (
            !nome ||
            !email ||
            !nome.trim() ||
            !email.trim()
        ) {

            return res.status(400).json({

                erro: 'Nome e e-mail são obrigatórios'

            });

        }


        const nomeLimpo = nome.trim();

        const emailLimpo = email.trim().toLowerCase();


        if (nomeLimpo.length > 120) {

            return res.status(400).json({

                erro: 'Nome muito longo'

            });

        }


        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            emailLimpo.length > 150 ||
            !emailValido.test(emailLimpo)
        ) {

            return res.status(400).json({

                erro: 'Informe um e-mail válido'

            });

        }


        if (telefone && telefone.length > 20) {

            return res.status(400).json({

                erro: 'Telefone muito longo'

            });

        }


        // VERIFICAR E-MAIL DE OUTRO USUÁRIO

        const usuarioExistente = await Usuario.buscarPorEmail(emailLimpo);

        if (
            usuarioExistente &&
            usuarioExistente.id_usuario !== req.usuario.id
        ) {

            return res.status(409).json({

                erro: 'Este e-mail já está sendo utilizado'

            });

        }


        // ATUALIZAR DADOS

        await Usuario.atualizar(req.usuario.id, {

            nome: nomeLimpo,

            email: emailLimpo,

            telefone

        });


        const usuarioAtualizado = await Usuario.buscarPorId(
            req.usuario.id
        );


        return res.status(200).json({

            mensagem: 'Perfil atualizado com sucesso!',

            usuario: usuarioAtualizado

        });


    } catch (error) {

        console.error('Erro ao atualizar perfil:', error);

        return res.status(500).json({

            erro: 'Não foi possível atualizar o perfil'

        });

    }

}


module.exports = {

    cadastrar,
    login,
    consultarPerfil,
    atualizarPerfil

};
