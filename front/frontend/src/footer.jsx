
import { Link } from "react-router-dom";

export default function Footer() {

  return (

    <footer className="site-footer">

      <div className="footer-main">

        <div>

          <Link to="/" className="brand footer-brand">

            <span className="brand-mark">a.</span>

            <span>
              atelier
              <span className="brand-light"> rental</span>
            </span>

          </Link>

          <p>
            Moda para viver momentos especiais
            <br />
            com mais liberdade e consciência.
          </p>

        </div>


        <div>

          <h4>Navegação</h4>

          <Link to="/">Início</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/perfil">Meu perfil</Link>

        </div>


        <div>

          <h4>Atendimento</h4>

          <span>Segunda a sexta</span>
          <span>9h às 18h</span>
          <span>contato@atelier.com</span>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Atelier Rental — Projeto demonstrativo.
        </span>

        <span>
          Vista, viva, devolva.
        </span>

      </div>

    </footer>

  );

}
