
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home() {

  return (
    <>

      <section className="hero">

        <div className="hero-copy">

          <span className="eyebrow">
            Vista novas possibilidades
          </span>

          <h1>
            Seu próximo look
            <br />
            <em>não precisa ser seu.</em>
          </h1>

          <p>
            Alugue roupas e acessórios especiais para viver
            cada ocasião com estilo, praticidade e escolhas
            mais conscientes.
          </p>

          <Link to="/catalogo" className="button button-dark">
            Explorar catálogo <span>↗</span>
          </Link>

          <div className="hero-note">
            <span className="note-line"></span>
            Moda para usar, amar e devolver.
          </div>

        </div>

        <div className="hero-visual">

          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=90"
            alt="Inspiração de moda e looks"
          />

          <div className="hero-sticker">
            <span>USE</span>
            <strong>mais</strong>
            <span>COMPARTILHE</span>
          </div>

        </div>

      </section>


      <section className="benefits-strip">

        <div>
          <span>01</span>
          <strong>Escolha seu look</strong>
          <small>Peças para cada momento</small>
        </div>

        <div>
          <span>02</span>
          <strong>Reserve pelo site</strong>
          <small>Simples e sem complicação</small>
        </div>

        <div>
          <span>03</span>
          <strong>Use e aproveite</strong>
          <small>Devolva após a locação</small>
        </div>

      </section>


      <section className="section-block">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              Curadoria especial
            </span>

            <h2>Peças em destaque</h2>
          </div>

          <Link to="/catalogo" className="text-link">
            Ver catálogo completo ↗
          </Link>

        </div>

        <div className="product-grid">

          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>


      <section className="about-band">

        <div className="about-image">

          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85"
            alt="Moda consciente"
          />

        </div>

        <div className="about-copy">

          <span className="eyebrow">
            Mais estilo, menos excesso
          </span>

          <h2>
            Uma nova forma
            <br />
            de viver a moda.
          </h2>

          <p>
            Acreditamos que você pode experimentar estilos,
            celebrar momentos e renovar o guarda-roupa sem
            precisar comprar tudo. Aqui, cada peça ganha
            novas histórias.
          </p>

          <Link to="/catalogo" className="text-link">
            Encontre sua próxima peça ↗
          </Link>

        </div>

      </section>


      <section className="how-section">

        <span className="eyebrow">
          É muito fácil
        </span>

        <h2>Como funciona a locação?</h2>

        <div className="steps-grid">

          <div>
            <b>01</b>
            <h3>Escolha</h3>
            <p>
              Navegue pelo catálogo e encontre a peça ideal.
            </p>
          </div>

          <div>
            <b>02</b>
            <h3>Reserve</h3>
            <p>
              Adicione ao carrinho e escolha o período desejado.
            </p>
          </div>

          <div>
            <b>03</b>
            <h3>Arrase</h3>
            <p>
              Receba, aproveite seu look e siga as orientações
              de devolução.
            </p>
          </div>

        </div>

      </section>

    </>
  );
}
