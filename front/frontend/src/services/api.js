
const API_URL = 'http://localhost:3000';


// =========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÕES
// =========================================

async function requisicao(endpoint, opcoes = {}) {

    const token = localStorage.getItem('atelier-token');

    const headers = {

        'Content-Type': 'application/json',

        ...opcoes.headers

    };


    // ENVIAR TOKEN QUANDO EXISTIR

    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }


    const resposta = await fetch(`${API_URL}${endpoint}`, {

        ...opcoes,

        headers

    });


    const dados = await resposta.json();


    if (!resposta.ok) {

        throw new Error(
            dados.erro || dados.mensagem || 'Erro na comunicação com o servidor'
        );

    }


    return dados;

}


// =========================================
// MÉTODOS DA API
// =========================================

export const api = {

    get(endpoint) {

        return requisicao(endpoint, {

            method: 'GET'

        });

    },


    post(endpoint, dados) {

        return requisicao(endpoint, {

            method: 'POST',

            body: JSON.stringify(dados)

        });

    },


    put(endpoint, dados) {

        return requisicao(endpoint, {

            method: 'PUT',

            body: JSON.stringify(dados)

        });

    },


    patch(endpoint, dados) {

        return requisicao(endpoint, {

            method: 'PATCH',

            body: JSON.stringify(dados)

        });

    },


    delete(endpoint) {

        return requisicao(endpoint, {

            method: 'DELETE'

        });

    }

};
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
        tag: Number(produto.quantidade_estoque) > 0
            ? "Disponível"
            : "Indisponível"
    }));
}