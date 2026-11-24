
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { buscarProdutos, requisicao } from "../services/api";

export default function Catalogo() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(["Todos"]);

    const [category, setCategory] = useState("Todos");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("featured");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function carregarCatalogo() {
            try {
                setLoading(true);
                setError("");

                const [produtosCarregados, respostaCategorias] =
                    await Promise.all([
                        buscarProdutos(),
                        requisicao("/api/categorias")
                    ]);

                if (cancelado) return;

                setProducts(produtosCarregados);

                const nomesCategorias = (
                    respostaCategorias.categorias || []
                ).map((item) => item.nome);

                setCategories(["Todos", ...nomesCategorias]);

            } catch (erro) {
                if (!cancelado) {
                    setError(erro.message || "Não foi possível carregar o catálogo.");
                }
            } finally {
                if (!cancelado) {
                    setLoading(false);
                }
            }
        }

        carregarCatalogo();

        return () => {
            cancelado = true;
        };
    }, []);

    const filtered = useMemo(() => {
        let result = products.filter((product) => {
            const correspondeCategoria =
                category === "Todos" || product.category === category;

            const termo = search.toLowerCase();

            const correspondeBusca =
                product.name.toLowerCase().includes(termo) ||
                product.description.toLowerCase().includes(termo);

            return correspondeCategoria && correspondeBusca;
        });

        if (sort === "low") {
            result = [...result].sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, category, search, sort]);

    function limparFiltros() {
        setSearch("");
        setCategory("Todos");
        setSort("featured");
    }

    return (
        <section className="catalog-page section-block">

            <div className="page-intro">
                <span className="eyebrow">
                    Encontre sua próxima peça
                </span>

                <h1>Nosso catálogo</h1>

                <p>
                    Uma seleção especial para transformar seus momentos.
                </p>
            </div>

            <div className="catalog-toolbar">

                <div className="filter-tabs">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "filter-tab selected"
                                    : "filter-tab"
                            }
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="catalog-controls">
                    <input
                        aria-label="Buscar peça"
                        placeholder="Buscar peça..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        aria-label="Ordenar produtos"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="featured">Em destaque</option>
                        <option value="low">Menor preço</option>
                        <option value="high">Maior preço</option>
                    </select>
                </div>

            </div>

            {loading ? (
                <div className="empty-state">
                    <h3>Carregando catálogo...</h3>
                    <p>Aguarde enquanto buscamos as peças disponíveis.</p>
                </div>

            ) : error ? (
                <div className="empty-state">
                    <h3>Não foi possível carregar o catálogo</h3>
                    <p>{error}</p>
                </div>

            ) : filtered.length > 0 ? (
                <div className="product-grid">
                    {filtered.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

            ) : (
                <div className="empty-state">
                    <h3>Nenhuma peça encontrada</h3>

                    <p>
                        Tente outro termo ou categoria.
                    </p>

                    <button
                        className="button button-dark"
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

        </section>
    );
}
