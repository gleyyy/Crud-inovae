
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    requisicao,
    salvarSessao
} from "../services/api";


export default function Login() {

    const [mode, setMode] = useState("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // ==========================================
    // LOGIN E CADASTRO
    // ==========================================

    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");
        setLoading(true);


        try {

            let resposta;


            // ==================================
            // CADASTRO
            // ==================================

            if (mode === "register") {

                if (!name.trim()) {

                    throw new Error(
                        "Informe seu nome para continuar."
                    );

                }

                resposta = await requisicao(
                    "/api/usuarios/cadastro",
                    {

                        method: "POST",

                        body: JSON.stringify({

                            nome: name.trim(),

                            email: email.trim(),

                            senha: password

                        })

                    }
                );

            }


            // ==================================
            // LOGIN
            // ==================================

            else {

                resposta = await requisicao(
                    "/api/usuarios/login",
                    {

                        method: "POST",

                        body: JSON.stringify({

                            email: email.trim(),

                            senha: password

                        })

                    }
                );

            }


            // ==================================
            // SALVAR SESSÃO
            // ==================================

            salvarSessao(
                resposta.token,
                resposta.usuario
            );


            setMessage(
                mode === "login"
                    ? "Login realizado com sucesso!"
                    : "Cadastro realizado com sucesso!"
            );


            // IR PARA A PÁGINA INICIAL

            navigate("/");


        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // ALTERAR ENTRE LOGIN E CADASTRO
    // ==========================================

    function alterarModo() {

        setMode(
            mode === "login"
                ? "register"
                : "login"
        );

        setMessage("");

        setPassword("");

    }


    return (

        <div className="login-layout">

            <div className="login-photo">

                <img
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
                    alt="Moda e estilo"
                />

                <div className="login-photo-caption">

                    <span>ATELIER RENTAL</span>

                    <h2>
                        Vista momentos.
                        <br />
                        <em>Crie memórias.</em>
                    </h2>

                </div>

            </div>


            <div className="login-panel">

                <Link to="/" className="brand login-brand">

                    <span className="brand-mark">a.</span>

                    <span>
                        atelier
                        <span className="brand-light"> rental</span>
                    </span>

                </Link>


                <div className="login-form-wrap">

                    <span className="eyebrow">
                        Boas-vindas
                    </span>

                    <h1>
                        {mode === "login"
                            ? "Acesse sua conta"
                            : "Crie sua conta"}
                    </h1>

                    <p>
                        {mode === "login"
                            ? "Entre para acompanhar suas escolhas e locações."
                            : "Faça seu cadastro para começar a explorar."}
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="form-stack"
                    >

                        {mode === "register" && (

                            <label>
                                Nome completo

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Como podemos te chamar?"
                                    maxLength="120"
                                    required
                                />

                            </label>

                        )}


                        <label>
                            E-mail

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="seuemail@exemplo.com"
                                maxLength="150"
                                required
                            />

                        </label>


                        <label>
                            Senha

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Digite sua senha"
                                minLength="8"
                                required
                            />

                        </label>


                        <button
                            className="button button-dark full-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Aguarde..."
                                : mode === "login"
                                    ? "Entrar"
                                    : "Criar conta"}

                        </button>

                    </form>


                    {message && (

                        <p className="form-message">
                            {message}
                        </p>

                    )}


                    <p className="switch-mode">

                        {mode === "login"
                            ? "Ainda não tem uma conta?"
                            : "Já possui uma conta?"}

                        <button
                            type="button"
                            onClick={alterarModo}
                        >

                            {mode === "login"
                                ? "Cadastre-se"
                                : "Fazer login"}

                        </button>

                    </p>


                </div>

            </div>

        </div>

    );

}
