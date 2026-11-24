
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./footer";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Carrinho from "./pages/Carrinho";

import "./App.css";

export default function App() {
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  return (
    <div className="app-shell">

      {!isLogin && <Navbar />}

      <main className={isLogin ? "main-content login-main" : "main-content"}>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalogo" element={<Catalogo />} />

          <Route path="/login" element={<Login />} />

          <Route path="/perfil" element={<Perfil />} />

          <Route path="/carrinho" element={<Carrinho />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </main>

      {!isLogin && <Footer />}

    </div>
  );
}
