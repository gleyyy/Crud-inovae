
import {
    produtosDemo,
    categoriasDemo,
    CHAVES
} from "./demoData";

// =========================================
// ARMAZENAMENTO LOCAL
// =========================================

function lerDados(chave, valorInicial) {
    try {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : valorInicial;
    } catch {
        return valorInicial;
    }
}

function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

function obterProdutos() {
    return lerDados(CHAVES.produtos, produtosDemo);
}

function obterUsuarios() {
    return lerDados(CHAVES.usuarios, []);
}

function obterLocacoes() {
    return lerDados(CHAVES.locacoes, []);
}

function obterUsuarioAtual() {
    return lerDados(CHAVES.usuario, null);
}

// =========================================
// SESSÃO
// =========================================

export function salvarSessao(token, usuario) {
    localStorage.setItem(CHAVES.token, token);
    salvarDados(CHAVES.usuario, usuario);
}

export function encerrarSessao() {
    localStorage.removeItem(CHAVES.token);
    localStorage.removeItem(CHAVES.usuario);
}

// =========================================
// RESPOSTAS SIMULADAS
// =========================================

function resposta(dados) {
    return dados;
}

function erro(mensagem) {
    throw new Error(mensagem);
}

// =========================================
// REQUISIÇÕES SIMULADAS
// =========================================

export async function requisicao(endpoint, opcoes = {}) {
    const metodo = (opcoes.method || "GET").toUpperCase();

    let dados = {};

    if (opcoes.body) {
        dados = typeof opcoes.body === "string"
            ? JSON.parse(opcoes.body)
            : opcoes.body;
    }

    const token = localStorage.getItem(CHAVES.token);
    const usuarioAtual = obterUsuarioAtual();

    // =====================================
    // USUÁRIOS
    // =====================================

    if (endpoint === "/api/usuarios/cadastro" && metodo === "POST") {
        const { nome, email, senha } = dados;

        if (!nome?.trim() || !email?.trim() || !senha) {
            erro("Preencha todos os campos.");
        }

        const usuarios = obterUsuarios();

        const emailExistente = usuarios.some(
            (usuario) =>
                usuario.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (emailExistente) {
            erro("Este e-mail já está cadastrado.");
        }

        const novoUsuario = {
            id_usuario: Date.now(),
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: "",
            tipo: "cliente"
        };

        // Senha armazenada apenas para a simulação acadêmica
        usuarios.push({
            ...novoUsuario,
            senha
        });

        salvarDados(CHAVES.usuarios, usuarios);

        const novoToken = `demo-${novoUsuario.id_usuario}`;

        salvarSessao(novoToken, novoUsuario);

        return resposta({
            mensagem: "Cadastro realizado com sucesso!",
            token: novoToken,
            usuario: novoUsuario
        });
    }

    if (endpoint === "/api/usuarios/login" && metodo === "POST") {
        const { email, senha } = dados;

        const usuarios = obterUsuarios();

        const usuario = usuarios.find(
            (item) =>
                item.email === email?.trim().toLowerCase() &&
                item.senha === senha
        );

        if (!usuario) {
            erro("E-mail ou senha incorretos.");
        }

        const { senha: senhaSalva, ...dadosUsuario } = usuario;

        const novoToken = `demo-${dadosUsuario.id_usuario}`;

        salvarSessao(novoToken, dadosUsuario);

        return resposta({
            mensagem: "Login realizado com sucesso!",
            token: novoToken,
            usuario: dadosUsuario
        });
    }

    if (endpoint === "/api/usuarios/perfil" && metodo === "GET") {
        if (!token || !usuarioAtual) {
            erro("Faça login para acessar seu perfil.");
        }

        return resposta({
            usuario: usuarioAtual
        });
    }

    if (endpoint === "/api/usuarios/perfil" && metodo === "PUT") {
        if (!token || !usuarioAtual) {
            erro("Faça login para atualizar seu perfil.");
        }

        const usuarios = obterUsuarios();

        const indice = usuarios.findIndex(
            (usuario) => usuario.id_usuario === usuarioAtual.id_usuario
        );

        if (indice === -1) {
            erro("Usuário não encontrado.");
        }

        const usuarioAtualizado = {
            ...usuarios[indice],
            nome: dados.nome ?? usuarios[indice].nome,
            email: dados.email?.trim().toLowerCase() ?? usuarios[indice].email,
            telefone: dados.telefone ?? usuarios[indice].telefone
        };

        const emailEmUso = usuarios.some(
            (usuario, i) =>
                i !== indice && usuario.email === usuarioAtualizado.email
        );

        if (emailEmUso) {
            erro("Este e-mail já está sendo utilizado.");
        }

        usuarios[indice] = usuarioAtualizado;
        salvarDados(CHAVES.usuarios, usuarios);

        const { senha, ...dadosUsuario } = usuarioAtualizado;

        salvarSessao(token, dadosUsuario);

        return resposta({
            mensagem: "Perfil atualizado com sucesso!",
            usuario: dadosUsuario
        });
    }

    // =====================================
    // PRODUTOS
    // =====================================

    if (endpoint === "/api/produtos" && metodo === "GET") {
        const url = new URLSearchParams(endpoint.includes("?") ? endpoint.split("?")[1] : "");

        let produtos = obterProdutos().filter(
            (produto) => produto.ativo !== false
        );

        const categoria = url.get("categoria");
        const busca = url.get("busca");

        if (categoria) {
            produtos = produtos.filter(
                (produto) =>
                    produto.categoria.toLowerCase() === categoria.toLowerCase()
            );
        }

        if (busca) {
            produtos = produtos.filter(
                (produto) =>
                    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    produto.descricao.toLowerCase().includes(busca.toLowerCase())
            );
        }

        return resposta({ produtos });
    }

    if (endpoint.startsWith("/api/produtos/") && metodo === "GET") {
        const id = Number(endpoint.split("?")[0].split("/").pop());

        const produto = obterProdutos().find(
            (item) => item.id_produto === id
        );

        if (!produto) {
            erro("Produto não encontrado.");
        }

        return resposta({ produto });
    }

    // =====================================
    // CATEGORIAS
    // =====================================

    if (endpoint === "/api/categorias" && metodo === "GET") {
        return resposta({
            categorias: categoriasDemo
        });
    }

    // =====================================
    // LOCAÇÕES
    // =====================================

    if (endpoint === "/api/locacoes" && metodo === "GET") {
        if (!token || !usuarioAtual) {
            erro("Faça login para consultar suas locações.");
        }

        const locacoes = obterLocacoes().filter(
            (locacao) => locacao.id_usuario === usuarioAtual.id_usuario
        );

        return resposta({ locacoes });
    }

    if (endpoint === "/api/locacoes" && metodo === "POST") {
        if (!token || !usuarioAtual) {
            erro("Faça login para realizar uma locação.");
        }

        const { data_inicio, data_fim, itens } = dados;

        if (!data_inicio || !data_fim || !Array.isArray(itens) || !itens.length) {
            erro("Confira as informações da locação.");
        }

        const inicio = new Date(`${data_inicio}T00:00:00`);
        const fim = new Date(`${data_fim}T00:00:00`);

        if (fim < inicio) {
            erro("A data final não pode ser anterior à data inicial.");
        }

        const dias = Math.floor((fim - inicio) / 86400000) + 1;

        const produtos = obterProdutos();
        let valorTotal = 0;

        const itensLocacao = itens.map((item) => {
            const produto = produtos.find(
                (p) => p.id_produto === Number(item.id_produto)
            );

            if (!produto) {
                erro("Um dos produtos não foi encontrado.");
            }

            const quantidade = Number(item.quantidade);

            if (
                !Number.isInteger(quantidade) ||
                quantidade < 1 ||
                quantidade > produto.quantidade_estoque
            ) {
                erro(`Estoque insuficiente para ${produto.nome}.`);
            }

            const subtotal = Number(produto.valor_diaria) * quantidade * dias;

            valorTotal += subtotal;

            return {
                id_produto: produto.id_produto,
                nome: produto.nome,
                quantidade,
                valor_diaria: Number(produto.valor_diaria),
                subtotal
            };
        });

        const locacoes = obterLocacoes();

        const novaLocacao = {
            id_locacao: Date.now(),
            id_usuario: usuarioAtual.id_usuario,
            data_inicio,
            data_fim,
            dias,
            status: "confirmada",
            valor_total: valorTotal,
            itens: itensLocacao,
            criado_em: new Date().toISOString()
        };

        locacoes.push(novaLocacao);
        salvarDados(CHAVES.locacoes, locacoes);

        return resposta({
            mensagem: "Locação realizada com sucesso!",
            locacao: novaLocacao
        });
    }

    erro("Operação não disponível no modo de demonstração.");
}

// =========================================
// MÉTODOS DA API
// =========================================

export const api = {
    get(endpoint) {
        return requisicao(endpoint, { method: "GET" });
    },

    post(endpoint, dados) {
        return requisicao(endpoint, {
            method: "POST",
            body: JSON.stringify(dados)
        });
    },

    put(endpoint, dados) {
        return requisicao(endpoint, {
            method: "PUT",
            body: JSON.stringify(dados)
        });
    },

    patch(endpoint, dados) {
        return requisicao(endpoint, {
            method: "PATCH",
            body: JSON.stringify(dados)
        });
    },

    delete(endpoint) {
        return requisicao(endpoint, { method: "DELETE" });
    }
};

// =========================================
// BUSCAR PRODUTOS
// =========================================

export async function buscarProdutos() {
    const resposta = await requisicao("/api/produtos");

    return (resposta.produtos || []).map((produto) => ({
        id: produto.id_produto,
        name: produto.nome,
        category: produto.categoria,
        price: Number(produto.valor_diaria),
        description: produto.descricao || "Peça disponível para locação.",
        image: produto.imagem_url || "",
        stock: Number(produto.quantidade_estoque),
        size: produto.tamanho || "",
        color: produto.cor || "",
        tag: produto.tag || (
            Number(produto.quantidade_estoque) > 0
                ? "Disponível"
                : "Indisponível"
        )
    }));
}
