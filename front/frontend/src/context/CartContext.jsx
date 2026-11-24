
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "atelier-rental-cart";

export function CartProvider({ children }) {

    const [items, setItems] = useState(() => {
        try {
            const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(salvos) ? salvos : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    function addToCart(product) {
        setItems((current) => {
            const estoque = Number(product.stock) || 0;

            if (estoque <= 0) return current;

            const existing = current.find(
                (item) => item.id === product.id
            );

            if (existing) {
                if (existing.quantity >= estoque) {
                    return current;
                }

                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...current,
                {
                    ...product,
                    price: Number(product.price),
                    stock: estoque,
                    quantity: 1,
                    rentalDays: 3
                }
            ];
        });
    }

    function removeFromCart(id) {
        setItems((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    function updateQuantity(id, quantity) {
        setItems((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                const estoque = Number(item.stock) || 1;
                const novaQuantidade = Math.max(
                    1,
                    Math.min(Number(quantity), estoque)
                );

                return {
                    ...item,
                    quantity: novaQuantidade
                };
            })
        );
    }

    function updateRentalDays(id, rentalDays) {
        const dias = Number(rentalDays);

        if (!Number.isInteger(dias) || dias < 1) return;

        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, rentalDays: dias }
                    : item
            )
        );
    }

    function clearCart() {
        setItems([]);
    }

    const totalItems = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.price || 0) *
            Number(item.quantity || 0) *
            Number(item.rentalDays || 1),
        0
    );

    const value = useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDays,
        clearCart,
        totalItems,
        total
    }), [items, totalItems, total]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart precisa ser usado dentro de CartProvider"
        );
    }

    return context;
}
