
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    requisicao,
    encerrarSessao
} from "../services/api";

function formatarData(data) {
    if (!data) return "—";

    const parteData = String(data).slice(0, 10);
    const [ano, mes, dia] = parteData.split("-");

    return `${dia}/${mes}/${ano}`;
}

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const statusLocacao = {
    pendente: "Aguardando confirmação",
    confirmada: "Confirmada",
    em_andamento: "Em andamento",
    concluida: "Concluída",
    cancelada: "Cancelada"
};

export default function Perfil() {

    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("atelier-user") || "null"
            );
        } catch {
            return null;
        }
    });

    const [name, setName] = useState(user?.nome || user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [telefone, setTelefone] = useState(user?.telefone || "");

    const [locacoes, setLocacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [historyError, setHistoryError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("atelier-token")) {
            setLoading(false);
            setLoadingHistory(false);
            return;
        }

        async function carregarPerfil() {
            try {
                const resposta = await requisicao(
                    "/api/usuarios/perfil"
                );

                const usuario =
                    resposta.usuario || resposta.perfil || resposta;

                setUser(usuario);
                setName(usuario.nome || usuario.name || "");
                setEmail(usuario.email || "");
                setTelefone(usuario.telefone || "");

                localStorage.setItem(
                    "atelier-user",
                    JSON.stringify(usuario)
                );
            } catch (erro) {
                setError(erro.message || "Não foi possível carregar o perfil.");
            } finally {
                setLoading(false);
            }
        }

        async function carregarLocacoes() {
            try {
                const resposta = await requisicao("/api/locacoes");

                setLocacoes(resposta.locacoes || []);
            } catch (erro) {
                setHistoryError(
                    erro.message || "Não foi possível carregar o histórico."
                );
            } finally {
                setLoadingHistory(false);
            }
        }

        carregarPerfil();
        carregarLocacoes();
    }, []);

    async function saveProfile(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSaved(false);

            await requisicao("/api/usuarios/perfil", {
                method: "PUT",
                body: JSON.stringify({
                nome: name,
                email,
                telefone
            })
            
            });

            const resposta = await requisicao(
                "/api/usuarios/perfil"
            );

            const usuario =
                resposta.usuario || resposta.perfil || resposta;

            setUser(usuario);
            setName(usuario.nome || usuario.name || "");
            setEmail(usuario.email || "");
            setTelefone(usuario.telefone || "");

            localStorage.setItem(
                "atelier-user",
                JSON.stringify(usuario)
            );

            setSaved(true);
        } catch (erro) {
            setError(
                erro.message || "Não foi possível atualizar seus dados."
            );
        } finally {
            setSaving(false);
        }
    }

    function logout() {
        encerrarSessao();
        setUser(null);
        setName("");
        setEmail("");
        setTelefone("");
        navigate("/");
    }

    if (!localStorage.getItem("atelier-token")) {
        return (
            <section className="section-block empty-state profile-locked">

                <span className="eyebrow">Área do cliente</span>

                <h1>Seu perfil</h1>

                <p>
                    Entre ou crie uma conta para visualizar seus dados.
                </p>

                <Link to="/login" className="button button-dark">
                    Acessar minha conta
                </Link>

            </section>
        );
    }

    if (loading) {
        return (
            <section className="section-block empty-state">
                <h2>Carregando perfil...</h2>
                <p>Aguarde enquanto buscamos suas informações.</p>
            </section>
        );
    }

    if (error && !user) {
        return (
            <section className="section-block empty-state">
                <h2>Não foi possível acessar seu perfil</h2>
                <p>{error}</p>

                <button
                    className="button button-dark"
                    onClick={logout}
                >
                    Fazer login novamente
                </button>
            </section>
        );
    }

    return (
        <section className="section-block profile-page">

            <div className="page-intro">

                <span className="eyebrow">Área do cliente</span>

                <h1>Meu perfil</h1>

                <p>
                    Gerencie suas informações pessoais e acompanhe suas locações.
                </p>

            </div>

            <div className="profile-card">

                <div className="profile-avatar">
                    {(name || "C").charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2>{name || "Cliente"}</h2>
                    <p>{email}</p>
                </div>

            </div>

            <form
                className="profile-form form-stack"
                onSubmit={saveProfile}
            >

                <h3>Dados pessoais</h3>

                <label>
                    Nome completo

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={120}
                    />
                </label>

                <label>
                    E-mail

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={150}
                    />
                </label>
                <label>
                    Telefone

                    <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        maxLength={20}
                    />
                </label>

                <div className="profile-actions">

                    <button
                        className="button button-dark"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </button>

                    <button
                        className="button button-outline"
                        type="button"
                        onClick={logout}
                    >
                        Sair da conta
                    </button>

                </div>

                {saved && (
                    <p className="form-message">
                        Informações atualizadas com sucesso!
                    </p>
                )}

                {error && (
                    <p className="form-message" role="alert">
                        {error}
                    </p>
                )}

            </form>

            <div className="history-placeholder">

                <h3>Minhas locações</h3>

                {loadingHistory ? (
                    <p>Carregando histórico...</p>
                ) : historyError ? (
                    <p>{historyError}</p>
                ) : locacoes.length === 0 ? (
                    <p>
                        Você ainda não possui locações. Explore o catálogo
                        e escolha suas peças favoritas!
                    </p>
                ) : (
                    <div className="rental-history">

                        {locacoes.map((locacao) => (
                            <article
                                className="rental-history-item"
                                key={locacao.id_locacao}
                            >

                                <div>
                                    <strong>
                                        Locação #{locacao.id_locacao}
                                    </strong>

                                    <p>
                                        Retirada: {formatarData(locacao.data_inicio)}
                                    </p>

                                    <p>
                                        Devolução: {formatarData(locacao.data_fim)}
                                    </p>
                                </div>

                                <div>
                                    <strong>
                                        {formatarDinheiro(locacao.valor_total)}
                                    </strong>

                                    <p>
                                        {statusLocacao[locacao.status] ||
                                            locacao.status}
                                    </p>
                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </div>

        </section>
    );
}
