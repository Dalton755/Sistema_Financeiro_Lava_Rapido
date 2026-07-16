import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
    listarMovimentacoes,
    listarCategorias,
    salvarMovimentacao,
    atualizarMovimentacao,
    carregarResumoFinanceiro,
    excluirMovimentacao
}
    from "../services/movimentacoes";

import { toast } from "react-toastify";
import { listarContas } from "../services/contas";

export default function Financeiro() {

    const [movimentacoes, setMovimentacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [idEdicao, setIdEdicao] = useState(null);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("TODOS");
    const [contas, setContas] = useState([]);

    const [exibirFormulario, setExibirFormulario] = useState(false);

    const [formulario, setFormulario] = useState({

        tipo: "RECEITA",

        categoria_id: "",

        descricao: "",

        valor: "",

        data_movimento: new Date()

            .toISOString()

            .substring(0, 10)

    });

    const [resumo, setResumo] = useState({

        receitas: 0,

        despesas: 0,

        saldo: 0

    });

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {

        try {

            const [
                dados,
                resumoFinanceiro,
                contas
            ] = await Promise.all([
                listarMovimentacoes(),
                carregarResumoFinanceiro(),
                listarContas()
            ]);

            console.log("Movimentações:", dados);

            setMovimentacoes(dados);

            setResumo(resumoFinanceiro);

            setContas(contas);

        } catch (error) {

            console.error("ERRO MOVIMENTAÇÕES:", error);

            toast.error(error.message);

        } finally {

            setCarregando(false);

        }

    }

    async function carregarCategorias(tipo) {

        try {

            const dados = await listarCategorias(tipo);

            setCategorias(dados);

        } catch (error) {

            toast.error("Erro ao carregar categorias.");

        }

    }

    async function salvar() {

        if (!formulario.categoria_id) {

            toast.warning("Selecione uma categoria.");

            return;

        }

        if (!formulario.descricao.trim()) {

            toast.warning("Informe a descrição.");

            return;

        }

        if (!formulario.valor || Number(formulario.valor) <= 0) {

            toast.warning("Informe um valor válido.");

            return;

        }

        try {

            const dados = {

                ...formulario,

                categoria_id: formulario.categoria_id || null,

                conta_id: formulario.conta_id || null,

                funcionario_id: formulario.funcionario_id || null,

                loja_id: formulario.loja_id || null,

                pessoa_id: formulario.pessoa_id || null,

                centro_custo_id: formulario.centro_custo_id || null,

                forma_pagamento_id: formulario.forma_pagamento_id || null,

                origem_id: formulario.origem_id || null,

                competencia: formulario.competencia || null,

                valor: Number(formulario.valor),

                status: "CONFIRMADO",

                origem: "MANUAL",

                ativo: true

            };

            if (idEdicao) {

                await atualizarMovimentacao(

                    idEdicao,

                    dados

                );

            } else {

                await salvarMovimentacao(

                    dados

                );

            }

            toast.success("Movimentação salva com sucesso.");

            setExibirFormulario(false);

            setIdEdicao(null);

            setFormulario({

                tipo: "RECEITA",

                categoria_id: "",

                conta_id: "",

                descricao: "",

                valor: "",

                data_movimento: new Date()

                    .toISOString()

                    .substring(0, 10)

            });

            setIdEdicao(null);

            carregar();

        } catch (error) {

            console.error(error);

            toast.error("Erro ao salvar movimentação.");

        }

    }

    async function excluir(id) {

        if (!confirm("Deseja excluir esta movimentação?")) {

            return;

        }

        try {

            await excluirMovimentacao(id);

            toast.success("Movimentação excluída.");

            carregar();

        } catch (error) {

            console.error(error);

            toast.error("Erro ao excluir.");

        }

    }

    function novaMovimentacao() {

        setIdEdicao(null);

        setFormulario({

            tipo: "RECEITA",

            categoria_id: "",

            conta_id: "",

            descricao: "",

            valor: "",

            data_movimento: new Date()

                .toISOString()

                .substring(0, 10)

        });

        carregarCategorias("RECEITA");

        setExibirFormulario(true);

    }

    async function editar(item) {

        const categorias = await listarCategorias(item.tipo);

        setCategorias(categorias);

        setFormulario({

            tipo: item.tipo,

            categoria_id: item.categoria_id ?? "",

            conta_id: item.conta_id ?? "",

            descricao: item.descricao ?? "",

            valor: String(item.valor),

            data_movimento: item.data_movimento

        });

        setIdEdicao(item.id);

        setExibirFormulario(true);

    }

    const movimentacoesFiltradas = movimentacoes.filter(item => {

        const texto = pesquisa.toLowerCase().trim();

        const passouPesquisa =

            item.descricao?.toLowerCase().includes(texto) ||

            item.categorias?.nome?.toLowerCase().includes(texto) ||

            item.tipo?.toLowerCase().includes(texto) ||

            item.status?.toLowerCase().includes(texto);

        const passouTipo =

            filtroTipo === "TODOS"

            ||

            item.tipo === filtroTipo;

        return passouPesquisa && passouTipo;

    });

    return (

        <Layout>

            <div className="page-header">

                <h1 className="page-title">

                    Financeiro

                </h1>

                <p className="page-subtitle">

                    Receitas e Despesas

                </p>

            </div>

            <div className="row mb-4">

                <div className="col-md-4">

                    <div className="card-app p-4">

                        <small className="text-muted">

                            Receitas

                        </small>

                        <h3 className="text-success mt-2">

                            {resumo.receitas.toLocaleString(

                                "pt-BR",

                                {

                                    style: "currency",

                                    currency: "BRL"

                                }

                            )}

                        </h3>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card-app p-4">

                        <small className="text-muted">

                            Despesas

                        </small>

                        <h3 className="text-danger mt-2">

                            {resumo.despesas.toLocaleString(

                                "pt-BR",

                                {

                                    style: "currency",

                                    currency: "BRL"

                                }

                            )}

                        </h3>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card-app p-4">

                        <small className="text-muted">

                            Saldo

                        </small>

                        <h3 className={

                            resumo.saldo >= 0

                                ? "text-success mt-2"

                                : "text-danger mt-2"

                        }>

                            {resumo.saldo.toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL"
                                }

                            )}

                        </h3>

                    </div>

                </div>

            </div>

            <div className="card-app p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h5>

                        Movimentações

                    </h5>

                    <div className="d-flex align-items-center gap-2">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar..."
                            style={{ width: "250px" }}
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                        />

                        <button
                            className="btn btn-primary"
                            onClick={async () => {

                                setIdEdicao(null);

                                const categorias = await listarCategorias("RECEITA");

                                setCategorias(categorias);

                                setFormulario({

                                    tipo: "RECEITA",

                                    categoria_id: "",

                                    conta_id: "",

                                    descricao: "",

                                    valor: "",

                                    data_movimento: new Date()

                                        .toISOString()

                                        .substring(0, 10)

                                });

                                setExibirFormulario(true);

                            }}
                        >

                            <i className="bi bi-plus-lg me-2"></i>

                            Nova Movimentação

                        </button>

                    </div>

                </div>

                <div className="d-flex gap-2 mb-3">

                    <button

                        className={`btn ${filtroTipo === "TODOS"
                            ? "btn-dark"
                            : "btn-outline-secondary"
                            }`}

                        onClick={() => setFiltroTipo("TODOS")}

                    >

                        Todos

                    </button>

                    <button

                        className={`btn ${filtroTipo === "RECEITA"

                            ? "btn-success"

                            : "btn-outline-success"}`}

                        onClick={() => setFiltroTipo("RECEITA")}

                    >

                        Receitas

                    </button>

                    <button

                        className={`btn ${filtroTipo === "DESPESA"

                            ? "btn-danger"

                            : "btn-outline-danger"}`}

                        onClick={() => setFiltroTipo("DESPESA")}

                    >

                        Despesas

                    </button>

                </div>

                {

                    carregando ?

                        <p>Carregando...</p>

                        :

                        movimentacoesFiltradas.length === 0 ?

                            <p className="text-muted">

                                Nenhuma movimentação cadastrada.

                            </p>

                            :



                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Data</th>

                                        <th>Tipo</th>

                                        <th>Descrição</th>

                                        <th>Categoria</th>

                                        <th className="text-end">

                                            Valor

                                        </th>

                                        <th>Status</th>

                                        <th width="80">

                                            Ações

                                        </th>

                                    </tr>

                                </thead>
                                <tbody>

                                    {

                                        movimentacoesFiltradas.map(item => (

                                            <tr key={item.id}>

                                                <td>

                                                    {new Date(item.data_movimento).toLocaleDateString("pt-BR")}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${item.tipo === "RECEITA"
                                                            ? "bg-success"
                                                            : "bg-danger"
                                                            }`}
                                                    >

                                                        {item.tipo}

                                                    </span>

                                                </td>

                                                <td>

                                                    {item.descricao}

                                                </td>

                                                <td>

                                                    {

                                                        item.categorias?.nome

                                                    }

                                                </td>

                                                <td className="text-end">

                                                    {Number(item.valor).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL"
                                                    })}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${item.status === "CONFIRMADO"
                                                            ? "bg-success"
                                                            : item.status === "PENDENTE"
                                                                ? "bg-warning text-dark"
                                                                : item.status === "CANCELADO"
                                                                    ? "bg-danger"
                                                                    : "bg-secondary"
                                                            }`}
                                                    >

                                                        {item.status}

                                                    </span>

                                                </td>

                                                <td className="text-center">

                                                    <div className="d-flex justify-content-center gap-2">

                                                        <button

                                                            className="btn btn-sm btn-outline-primary"

                                                            title="Editar"

                                                            onClick={() => editar(item)}

                                                        >

                                                            <i className="bi bi-pencil"></i>

                                                        </button>

                                                        <button

                                                            className="btn btn-sm btn-outline-danger"

                                                            title="Excluir"

                                                            onClick={() => excluir(item.id)}

                                                        >

                                                            <i className="bi bi-trash"></i>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                }

            </div>

            {

                exibirFormulario && (

                    <div className="card-app mt-4 p-4">

                        <h5>

                            {

                                idEdicao

                                    ? "Editar Movimentação"

                                    : "Nova Movimentação"

                            }

                        </h5>

                        <hr />

                        <div className="row g-3">

                            <div className="col-md-3">

                                <label className="form-label">

                                    Tipo

                                </label>

                                <select
                                    className="form-select"
                                    value={formulario.tipo}
                                    onChange={async (e) => {

                                        const tipo = e.target.value;

                                        setFormulario({

                                            ...formulario,

                                            tipo,

                                            categoria_id: ""

                                        });

                                        await carregarCategorias(tipo);

                                    }}
                                >

                                    <option value="RECEITA">

                                        Receita

                                    </option>

                                    <option value="DESPESA">

                                        Despesa

                                    </option>

                                </select>

                            </div>

                            <div className="col-md-5">

                                <label className="form-label">

                                    Categoria

                                </label>

                                <select
                                    className="form-select"
                                    value={formulario.categoria_id}
                                    onChange={(e) =>
                                        setFormulario({
                                            ...formulario,
                                            categoria_id: e.target.value
                                        })
                                    }
                                >

                                    <option value="">

                                        Selecione...

                                    </option>

                                    {

                                        categorias.map(categoria => (

                                            <option
                                                key={categoria.id}
                                                value={categoria.id}
                                            >

                                                {categoria.nome}

                                            </option>

                                        ))

                                    }

                                </select>

                                <div className="col-md-4">

                                    <label className="form-label">

                                        Conta Financeira

                                    </label>

                                    <select

                                        className="form-select"

                                        value={formulario.conta_id}

                                        onChange={(e) =>

                                            setFormulario({

                                                ...formulario,

                                                conta_id: e.target.value

                                            })

                                        }

                                    >

                                        <option value="">

                                            Selecione...

                                        </option>

                                        {

                                            contas.map(conta => (

                                                <option

                                                    key={conta.id}

                                                    value={conta.id}

                                                >

                                                    {conta.nome}

                                                </option>

                                            ))

                                        }

                                    </select>

                                </div>

                            </div>

                            <div className="col-md-9">

                                <label className="form-label">

                                    Descrição

                                </label>

                                <input
                                    className="form-control"
                                    value={formulario.descricao}
                                    onChange={(e) =>
                                        setFormulario({
                                            ...formulario,
                                            descricao: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">

                                    Valor

                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={formulario.valor}
                                    onChange={(e) =>
                                        setFormulario({
                                            ...formulario,
                                            valor: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">

                                    Data

                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={formulario.data_movimento}
                                    onChange={(e) =>
                                        setFormulario({
                                            ...formulario,
                                            data_movimento: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                        <div className="mt-4 d-flex gap-2">

                            <button
                                className="btn btn-secondary"
                                onClick={() => {

                                    setExibirFormulario(false);

                                    setIdEdicao(null);

                                    setFormulario({

                                        tipo: "RECEITA",

                                        categoria_id: "",

                                        conta_id: "",

                                        descricao: "",

                                        valor: "",

                                        data_movimento: new Date()

                                            .toISOString()

                                            .substring(0, 10)

                                    });

                                }}
                            >

                                Cancelar

                            </button>

                            <button
                                className="btn btn-success"
                                onClick={salvar}
                            >
                                {idEdicao ? "Atualizar" : "Salvar"}
                            </button>

                        </div>

                    </div>

                )

            }

        </Layout>

    )

}