import {
    formatarMoeda,
    formatarData
} from "../../lib/formatadores";

import { useEffect, useState } from "react";

import {
    listarContasRecebimento,
    confirmarRecebimento
} from "../../services/recebimentos";

import { toast } from "react-toastify";



export default function RecebimentoCard({

    recebimento,

    onConfirmado

}) {

    const [contas, setContas] = useState([]);

    const [contaSelecionada, setContaSelecionada] = useState("");

    useEffect(() => {

        carregarContas();

    }, []);

    async function carregarContas() {

        try {

            const lista = await listarContasRecebimento();

            setContas(lista);

        } catch (erro) {

            console.error(erro);

        }

    }

    async function confirmar() {

        if (!contaSelecionada) {

            toast.warning(

                "Selecione uma conta."

            );

            return;

        }

        try {

            const resposta =

                await confirmarRecebimento({

                    messageId: recebimento.messageId,

                    contaId: contaSelecionada

                });

            console.log(resposta);

            toast.success(

                "Recebimento confirmado."

            );
            onConfirmado?.();

        }

        catch (erro) {

            console.error(erro);

            toast.error(

                "Erro ao confirmar recebimento."

            );

        }

    }

    return (

        <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <div className="d-flex align-items-center mb-2">

                            <i className="bi bi-building text-primary fs-2 me-3"></i>

                            <h3 className="fw-bold mb-0">

                                {recebimento.fornecedor}

                            </h3>

                        </div>

                        <div className="text-secondary">

                            <div>

                                <strong>

                                    Fornecedor:

                                </strong>

                                {" "}

                                {recebimento.fornecedorCodigo}

                            </div>

                            <div>

                                <strong>

                                    Pagamento:

                                </strong>

                                {" "}

                                {formatarData(recebimento.dataPagamento)}

                            </div>

                        </div>

                    </div>

                    <div className="text-end">

                        <div className="text-secondary small">

                            Total

                        </div>

                        <div className="fs-2 fw-bold text-success">

                            {formatarMoeda(recebimento.valorTotal)}

                        </div>

                    </div>

                </div>

                <table className="table table-hover align-middle mt-4">
                    <thead>

                        <tr>

                            <th>NF</th>

                            <th>Emissão</th>

                            <th className="text-end">Bruto</th>

                            <th className="text-end">Desconto</th>

                            <th className="text-end">Líquido</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            recebimento.itens.map(item => (

                                <tr key={item.id}>

                                    <td>

                                        {item.numeroNF}

                                    </td>

                                    <td>

                                        {formatarData(item.dataEmissao)}

                                    </td>

                                    <td className="text-end">

                                        {formatarMoeda(item.valorBruto)}

                                    </td>

                                    <td className="text-end text-danger">

                                        {formatarMoeda(item.desconto)}

                                    </td>

                                    <td className="text-end fw-bold text-success">

                                        {formatarMoeda(item.valorLiquido)}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            <div className="row align-items-end mt-4">

                <div className="col-lg-7">

                    <label className="form-label fw-semibold text-secondary">

                        Conta de Recebimento

                    </label>

                    <select

                        className="form-select form-select-lg"

                        value={contaSelecionada}

                        onChange={(e) =>

                            setContaSelecionada(e.target.value)

                        }

                    >

                        <option value="">

                            Selecione uma conta

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

                <div className="col-lg-3 d-grid">

                    <button

                        className="btn btn-success btn-lg"

                        onClick={confirmar}

                    >

                        <i className="bi bi-check-circle me-2"></i>

                        Confirmar

                    </button>

                </div>

            </div>

        </div>

    );

}