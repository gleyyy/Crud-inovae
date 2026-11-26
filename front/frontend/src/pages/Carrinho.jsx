
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { requisicao } from "../services/api";

const money = (value) =>
    `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function adicionarDias(data, quantidade) {
    const novaData = new Date(`${data}T12:00:00`);
    novaData.setDate(novaData.getDate() + quantidade);
    return formatarData(novaData);
}

export default function Carrinho() {

    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart
    } = useCart();

    const hoje = formatarData(new Date());

    const [dataInicio, setDataInicio] = useState(hoje);
    const [dias, setDias] = useState(3);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const dataFim = adicionarDias(dataInicio, Number(dias) - 1);

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            Number(item.quantity) *
            Number(dias),
        0
    );

    const totalItems = items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    async function finishOrder() {

        try {
            setLoading(true);
            setErro("");
            setSucesso("");

            if (!localStorage.getItem("atelier-token")) {
                throw new Error(
                    "Faça login antes de solicitar uma locação."
                );
            }

            const resposta = await requisicao("/api/locacoes", {
                method: "POST",
                body: JSON.stringify({
                    data_inicio: dataInicio,
                    data_fim: dataFim,
                    itens: items.map((item) => ({
                        id_produto: Number(item.id),
                        quantidade: Number(item.quantity)
                    }))
                })
            });

            setSucesso(
                `Locação nº ${resposta.locacao.id_locacao} solicitada com sucesso!`
            );

            clearCart();

        } catch (error) {
            setErro(
                error.message || "Não foi possível realizar a locação."
            );
        } finally {
            setLoading(false);
        }
    }

    if (sucesso) {
        return (
            <section className="section-block empty-state cart-empty">
                <span className="eyebrow">Solicitação concluída</span>

                <h1>Locação realizada!</h1>

                <p>{sucesso}</p>

                <p>
                    Sua solicitação foi registrada e está aguardando
                    confirmação.
                </p>

                <Link to="/catalogo" className="button button-dark">
                    Voltar ao catálogo
                </Link>
            </section>
        );
    }

    if (!items.length) {
        return (
            <section className="section-block empty-state cart-empty">
                <span className="empty-icon">▱</span>

                <span className="eyebrow">Sua seleção</span>

                <h1>Seu carrinho está vazio</h1>

                <p>
                    Explore o catálogo e escolha as peças que deseja alugar.
                </p>

                <Link to="/catalogo" className="button button-dark">
                    Explorar catálogo
                </Link>
            </section>
        );
    }

    return (
        <section className="section-block cart-page">

            <div className="page-intro">
                <span className="eyebrow">Quase lá</span>

                <h1>Seu carrinho</h1>

                <p>
                    Confira suas peças e escolha o período de locação.
                </p>
            </div>

            <div className="cart-layout">

                <div className="cart-items">

                    {items.map((item) => (

                        <article className="cart-item" key={item.id}>

                            <img
                                src={
                                    item.image ||
                                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"
                                }
                                alt={item.name}
                            />

                            <div className="cart-item-info">

                                <span className="product-category">
                                    {item.category}
                                </span>

                                <h3>{item.name}</h3>

                                <p>{money(item.price)} por dia</p>

                                <div className="cart-controls">

                                    <label>
                                        Quantidade

                                        <select
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(
                                                    item.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {Array.from(
                                                {
                                                    length: Math.max(
                                                        1,
                                                        Number(item.stock) || 1
                                                    )
                                                },
                                                (_, index) => index + 1
                                            ).map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                </div>

                            </div>

                            <div className="cart-item-end">

                                <strong>
                                    {money(
                                        item.price *
                                        item.quantity *
                                        dias
                                    )}
                                </strong>

                                <button
                                    className="remove-button"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remover
                                </button>

                            </div>

                        </article>

                    ))}

                    <button
                        className="clear-cart"
                        onClick={clearCart}
                    >
                        Limpar carrinho
                    </button>

                </div>

                <aside className="order-summary">

                    <h2>Resumo da locação</h2>

                    <div>
                        <span>Peças selecionadas</span>
                        <strong>{totalItems}</strong>
                    </div>

                    <div>
                        <span>Data de retirada</span>

                        <strong>
                            <input
                                type="date"
                                value={dataInicio}
                                min={hoje}
                                onChange={(e) =>
                                    setDataInicio(e.target.value)
                                }
                            />
                        </strong>
                    </div>

                    <div>
                        <span>Duração da locação</span>

                        <strong>
                            <select
                                value={dias}
                                onChange={(e) =>
                                    setDias(Number(e.target.value))
                                }
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 10, 15].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? "dia" : "dias"}
                                    </option>
                                ))}
                            </select>
                        </strong>
                    </div>

                    <div>
                        <span>Data de devolução</span>
                        <strong>{dataFim.split("-").reverse().join("/")}</strong>
                    </div>

                    <div>
                        <span>Subtotal da locação</span>
                        <strong>{money(total)}</strong>
                    </div>

                    <p className="summary-note">
                        Valores demonstrativos. Taxas, caução,
                        retirada e devolução seguem as regras da loja.
                    </p>

                    <div className="summary-total">
                        <span>Total estimado</span>
                        <strong>{money(total)}</strong>
                    </div>

                    {erro && (
                        <p role="alert" className="summary-note">
                            {erro}
                        </p>
                    )}

                    <button
                        className="button button-dark full-button"
                        onClick={finishOrder}
                        disabled={loading}
                    >
                        {loading
                            ? "Registrando locação..."
                            : "Confirmar locação"}
                    </button>

                    <Link to="/catalogo" className="back-link">
                        ← Continuar escolhendo
                    </Link>

                </aside>

            </div>

        </section>
    );
}
