
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {

  const { totalItems } = useCart();

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("atelier-user") || "null"
  );

  function linkClass({ isActive }) {
    return isActive
      ? "nav-link active"
      : "nav-link";
  }

  return (
    <header className="site-header">

      <div className="nav-inner">

        <Link to="/" className="brand">
          <span className="brand-mark">a.</span>

          <span>
            atelier
            <span className="brand-light"> rental</span>
          </span>
        </Link>

        <nav className="desktop-nav">

          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>

          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>

          <NavLink to="/perfil" className={linkClass}>
            Meu perfil
          </NavLink>

        </nav>

        <div className="nav-actions">

          <button
            className="icon-button account-button"
            onClick={() => navigate(user ? "/perfil" : "/login")}
            aria-label="Acessar conta"
          >
            ♙
          </button>

          <Link
            to="/carrinho"
            className="cart-link"
            aria-label={`Carrinho com ${totalItems} itens`}
          >
            <span className="cart-symbol">▱</span>

            <span className="cart-count">
              {totalItems}
            </span>
          </Link>

          <button
            className="mobile-menu"
            onClick={() => navigate("/catalogo")}
            aria-label="Abrir catálogo"
          >
            ☰
          </button>

        </div>

      </div>

    </header>
  );
}
