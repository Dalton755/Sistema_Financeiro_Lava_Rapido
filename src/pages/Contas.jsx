import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
    listarContas,
    salvarConta
} from "../services/contas";

import { toast } from "react-toastify";

export default function Contas() {

    const [contas, setContas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [exibirFormulario, setExibirFormulario] = useState(false);

    const [formulario, setFormulario] = useState({

        nome: "",

        tipo: "BANCO",

        saldo_inicial: ""

    });

    async function carregar() {

        try {

            const dados = await listarContas();

            setContas(dados);

        } catch (error) {

            console.error(error);

            toast.error("Erro ao carregar contas.");

        } finally {

            setCarregando(false);

        }

    }

    async function salvar() {

        if (!formulario.nome.trim()) {

            toast.warning("Informe o nome da conta.");

            return;

        }

        try {

            await salvarConta({

                nome: formulario.nome,

                tipo: formulario.tipo,

                saldo_inicial: Number(formulario.saldo_inicial || 0),

                saldo_atual: Number(formulario.saldo_inicial || 0),

                ativo: true

            });

            toast.success("Conta cadastrada.");

            setFormulario({

                nome: "",

                tipo: "BANCO",

                saldo_inicial: ""

            });

            setExibirFormulario(false);

            carregar();

        } catch (error) {

            console.error(error);

            toast.error("Erro ao salvar conta.");

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    return (

        <Layout>

            <div className="page-header">

                <h1 className="page-title">

                    Contas Financeiras

                </h1>

                <p className="page-subtitle">

                    Cadastro de contas bancárias

                </p>

            </div>

            <div className="card-app p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h5>Contas</h5>

                    <button

                        className="btn btn-primary"

                        onClick={() => setExibirFormulario(true)}

                    >

                        <i className="bi bi-plus-lg me-2"></i>

                        Nova Conta

                    </button>

                </div>

                {

                    carregando ?

                        <p>Carregando...</p>

                        :

                        contas.length === 0 ?

                            <p className="text-muted">

                                Nenhuma conta cadastrada.

                            </p>

                            :

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Nome</th>

                                        <th>Tipo</th>

                                        <th className="text-end">

                                            Saldo Atual

                                        </th>

                                        <th>

                                            Status

                                        </th>

                                        <th width="90">

                                            Ações

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        contas.map(conta => (

                                            <tr>

                                                <td>

                                                    {conta.nome}

                                                </td>

                                                <td>

                                                    {conta.tipo}

                                                </td>

                                                <td className="text-end">

                                                    {Number(conta.saldo_atual).toLocaleString(

                                                        "pt-BR",

                                                        {

                                                            style: "currency",

                                                            currency: "BRL"

                                                        }

                                                    )}

                                                </td>

                                                <td>

                                                    <span className="badge bg-success">

                                                        Ativa

                                                    </span>

                                                </td>

                                                <td className="text-center">

                                                    <div className="d-flex justify-content-center gap-2">

                                                        <button

                                                            className="btn btn-sm btn-outline-primary"

                                                            title="Editar"

                                                        >

                                                            <i className="bi bi-pencil"></i>

                                                        </button>

                                                        <button

                                                            className="btn btn-sm btn-outline-danger"

                                                            title="Excluir"

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

                            Nova Conta

                        </h5>

                        <hr />

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label">

                                    Nome

                                </label>

                                <input

                                    className="form-control"

                                    value={formulario.nome}

                                    onChange={(e) =>

                                        setFormulario({

                                            ...formulario,

                                            nome: e.target.value

                                        })

                                    }

                                />

                            </div>

                            <div className="col-md-3">

                                <label className="form-label">

                                    Tipo

                                </label>

                                <select

                                    className="form-select"

                                    value={formulario.tipo}

                                    onChange={(e) =>

                                        setFormulario({

                                            ...formulario,

                                            tipo: e.target.value

                                        })

                                    }

                                >

                                    <option value="BANCO">

                                        Banco

                                    </option>

                                    <option value="CAIXA">

                                        Caixa

                                    </option>

                                </select>

                            </div>

                            <div className="col-md-3">

                                <label className="form-label">

                                    Saldo Inicial

                                </label>

                                <input

                                    type="number"

                                    step="0.01"

                                    className="form-control"

                                    value={formulario.saldo_inicial}

                                    onChange={(e) =>

                                        setFormulario({

                                            ...formulario,

                                            saldo_inicial: e.target.value

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

                                    setFormulario({

                                        nome: "",

                                        tipo: "BANCO",

                                        saldo_inicial: ""

                                    });

                                }}

                            >

                                Cancelar

                            </button>

                            <button

                                className="btn btn-success"

                                onClick={salvar}

                            >

                                Salvar

                            </button>

                        </div>

                    </div>

                )

            }

        </Layout>

    );

}