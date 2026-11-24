
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const [added, setAdded] = useState(false);

    const disponivel = product.stock > 0;

    function handleAdd() {
        if (!disponivel) return;

        addToCart(product);

        setAdded(true);

        window.setTimeout(() => {
            setAdded(false);
        }, 1400);
    }

    return (
        <article className="product-card">

            <div className="product-image-wrap">

                <img
                    src={
                        product.image ||
                        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"
                    }
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />

                <span className="product-tag">
                    {disponivel ? product.tag : "Indisponível"}
                </span>

            </div>

            <div className="product-info">

                <div>
                    <span className="product-category">
                        {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p>{product.description}</p>
                </div>

                <div className="product-bottom">

                    <div className="price">
                        <strong>
                            R$ {product.price.toFixed(2).replace(".", ",")}
                        </strong>

                        <span>/ dia</span>
                    </div>

                    <button
                        className={`add-button ${added ? "added" : ""}`}
                        onClick={handleAdd}
                        disabled={!disponivel}
                    >
                        {!disponivel
                            ? "Indisponível"
                            : added
                                ? "Adicionado ✓"
                                : "Alugar"}
                    </button>

                </div>

            </div>

        </article>
    );
}
