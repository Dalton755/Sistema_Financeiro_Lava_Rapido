import { useEffect, useState } from "react";

import { listarRecebimentos } from "../../../services/recebimentos";

import { formatarMoeda } from "../../../lib/formatadores";

export default function ExecutiveRecebimentos() {

    const [

        recebimentos,

        setRecebimentos

    ] = useState([]);

    useEffect(() => {

        carregar();

    }, []);

    async function carregar() {

        try {

            const dados =

                await listarRecebimentos();

            setRecebimentos(dados);

        }

        catch (erro) {

            console.error(erro);

        }

    }

    const quantidadeRecebimentos =

        recebimentos.length;

    const quantidadeNotas =

        recebimentos.reduce(

            (total, item) =>

                total + Number(item.quantidadeNotas ?? 0),

            0

        );

    const valorTotal =

        recebimentos.reduce(

            (total, item) =>

                total + Number(item.valorTotal ?? 0),

            0

        );

    const topFornecedores =

        [...recebimentos]

            .sort(

                (a, b) =>

                    b.valorTotal - a.valorTotal

            )

            .slice(0, 3);

    return (

        <div className="card shadow-sm border-0 mt-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <div>

                        <h5 className="mb-0">

                            📥 Recebimentos Pendentes

                        </h5>

                        <small className="text-muted">

                            Valores aguardando confirmação

                        </small>

                    </div>

                    <span className="badge bg-warning text-dark">

                        {quantidadeRecebimentos}

                    </span>

                </div>

                <div className="text-center py-4">

                    <div className="text-uppercase text-muted small">

                        Valor aguardando confirmação

                    </div>

                    <h1 className="fw-bold text-success my-2">

                        {formatarMoeda(valorTotal)}

                    </h1>

                    <div className="text-muted">

                        <strong>{quantidadeRecebimentos}</strong> recebimentos •{" "}

                        <strong>{quantidadeNotas}</strong> notas fiscais

                    </div>

                </div>

                <hr />

                {

                    topFornecedores.map((item) => (

                        <div
                            key={item.messageId}
                            className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >

                            <div>

                                <div className="fw-semibold">

                                    {item.fornecedor}

                                </div>

                            </div>

                            <span className="badge bg-success-subtle text-success fs-6">

                                {formatarMoeda(item.valorTotal)}

                            </span>

                        </div>

                    ))

                }

                <hr />

                <div className="d-grid mt-3">

                    <button
                        className="btn btn-outline-primary"
                    >

                        <i className="bi bi-arrow-right-circle me-2"></i>

                        Ver todos os recebimentos

                    </button>

                </div>

            </div>

        </div>

    );

}