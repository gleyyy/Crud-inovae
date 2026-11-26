
import { products } from "../data/products";

// Produtos utilizados durante a demonstração
export const produtosDemo = products.map((produto) => ({
    id_produto: produto.id,
    id_categoria: produto.category,
    nome: produto.name,
    categoria: produto.category,
    descricao: produto.description,
    valor_diaria: produto.price,
    imagem_url: produto.image,
    quantidade_estoque: 5,
    tamanho: "Único",
    cor: "Variada",
    ativo: true,
    tag: produto.tag
}));

// Categorias disponíveis
export const categoriasDemo = [
    { id_categoria: 1, nome: "Acessórios" },
    { id_categoria: 2, nome: "Roupas" },
    { id_categoria: 3, nome: "Vestidos" }
];

// Chaves utilizadas no armazenamento do navegador
export const CHAVES = {
    produtos: "atelier-demo-produtos",
    usuarios: "atelier-demo-usuarios",
    locacoes: "atelier-demo-locacoes",
    token: "atelier-token",
    usuario: "atelier-user"
};
