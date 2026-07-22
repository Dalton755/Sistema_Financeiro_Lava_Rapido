import { useEffect, useState } from "react";

import { listarDemonstrativos } from "../../services/demonstrativos";

import { buscarDemonstrativo } from "../../services/demonstrativos";

import DemonstrativoCard from "../../components/demonstrativos/DemonstrativoCard";

import DemonstrativoModal from "../../components/demonstrativos/DemonstrativoModal";

import Layout from "../../components/Layout";



export default function DemonstrativosPage() {


    const [demonstrativos, setDemonstrativos] = useState([]);

    const [modalAberto, setModalAberto] = useState(false);

    const [demonstrativoSelecionado, setDemonstrativoSelecionado] = useState(null);

    const [pesquisa, setPesquisa] = useState("");

    const [carregando, setCarregando] = useState(true);



    async function carregarDemonstrativos() {

        try {

            setCarregando(true);

            const data =
                await listarDemonstrativos();

            setDemonstrativos(data);

        } catch (error) {

            console.error(error);

        } finally {

            setCarregando(false);

        }

    }

    useEffect(() => {

        carregarDemonstrativos();

    }, []);



    async function visualizar(demo) {

        const dados =
            await buscarDemonstrativo(demo.id);

        setDemonstrativoSelecionado(dados);

        setModalAberto(true);

    }

    const demonstrativosFiltrados =
        demonstrativos.filter(item =>
            item.funcionario_nome
                .toLowerCase()
                .includes(pesquisa.toLowerCase())
        );

    return (

        <Layout>

            <div className="min-h-screen bg-slate-100 p-6">

                <div className="max-w-7xl mx-auto">

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <div className="d-flex align-items-center mb-4">

                                <div
                                    className="bg-primary bg-gradient rounded-4 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: 60,
                                        height: 60
                                    }}
                                >

                                    <i
                                        className="bi bi-file-earmark-text-fill text-white fs-3"
                                    />

                                </div>

                                <div>

                                    <h1 className="fw-bold mb-1">

                                        Demonstrativos

                                    </h1>

                                    <p className="text-muted mb-0">

                                        Consulte e acompanhe os demonstrativos de pagamento dos funcionários.

                                    </p>

                                </div>

                            </div>

                        </div>

                        <input

                            type="text"

                            placeholder="Pesquisar funcionário..."

                            value={pesquisa}

                            onChange={(e) => setPesquisa(e.target.value)}

                            className="w-80 rounded-xl border border-slate-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />

                    </div>

                    <div className="row g-4">

                        {demonstrativosFiltrados.map(d => (

                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={d.id}
                            >

                                <DemonstrativoCard
                                    demonstrativo={d}
                                    onVisualizar={visualizar}
                                />

                            </div>

                        ))}

                    </div>

                    <DemonstrativoModal

                        aberto={modalAberto}

                        demonstrativo={demonstrativoSelecionado}

                        onClose={() => {

                            setModalAberto(false);

                            setDemonstrativoSelecionado(null);

                        }}

                        onRegistrarPagamento={(demo) => {

                            console.log("Registrar pagamento", demo);

                        }}

                    />

                </div>

            </div>

        </Layout>

    );

}