import { gerarPdfDemonstrativo } from "../../pdf/demonstrativoPdf";

export default function DemonstrativoModal({

    aberto,

    demonstrativo,

    onClose,

    onRegistrarPagamento

}) {

    if (!aberto || !demonstrativo) return null;

    const {

        demonstrativo: cabecalho,

        itens,

        resumo

    } = demonstrativo;

    const valorLiquido =
        Number(cabecalho.valor_liquido ?? 0);

    const valorBruto =
        Number(resumo.valorBruto ?? 0);

    const adiantamentos =
        Number(cabecalho.adiantamentos ?? 0);

    function formatarCompetencia(valor) {

        if (!valor) return "-";

        const data = new Date(valor);

        return data.toLocaleDateString(
            "pt-BR",
            {
                month: "short",
                year: "numeric"
            }
        );

    }

    return (

        <>
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,.55)"
                }}
            >

                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div className="modal-content">

                        <div className="modal-header">

                            <div className="border-bottom pb-4 mb-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <div className="d-flex align-items-center mb-3">

                                            <div
                                                className="bg-primary bg-gradient rounded-3 d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: 52,
                                                    height: 52
                                                }}
                                            >

                                                <i className="bi bi-file-earmark-text-fill text-white fs-4"></i>

                                            </div>

                                            <div>

                                                <h3 className="fw-bold mb-0">

                                                    Demonstrativo de Pagamento

                                                </h3>

                                                <small className="text-muted">

                                                    Demonstrativo financeiro do colaborador

                                                </small>

                                            </div>

                                        </div>

                                        <h2 className="fw-bold mb-1">

                                            {cabecalho.funcionario_nome}

                                        </h2>

                                        <div className="text-muted mb-2">

                                            {cabecalho.cargo}

                                            {" • "}

                                            {cabecalho.loja}

                                        </div>

                                        <div className="small text-secondary">

                                            <strong>CPF:</strong>

                                            {" "}

                                            {cabecalho.cpf || "-"}

                                        </div>

                                    </div>

                                    <div className="text-end">

                                        <span className="badge bg-primary rounded-pill px-3 py-2">

                                            GERADO

                                        </span>

                                        <div className="mt-3 text-muted">

                                            <strong>Competência</strong>

                                        </div>

                                        <div>

                                            {formatarCompetencia(
                                                cabecalho.fechamento?.competencia
                                            )}

                                            {" • "}

                                            {cabecalho.fechamento?.quinzena}ª Quinzena

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <button
                                className="btn-close"
                                onClick={onClose}
                            />

                        </div>

                        <div className="modal-body">



                            <div className="row g-3 mb-4">

                                <ResumoCard
                                    titulo="Horas"
                                    icone="bi-clock-history"
                                    valor={`${resumo.totalHoras} h`}
                                    cor="primary"
                                />

                                <ResumoCard
                                    titulo="Extras"
                                    icone="bi-lightning-charge-fill"
                                    valor={`${resumo.totalHorasExtras} h`}
                                    cor="warning"
                                />

                                <ResumoCard
                                    titulo="Bruto"
                                    icone="bi-cash-stack"
                                    valor={`R$ ${valorBruto.toFixed(2)}`}
                                    cor="success"
                                />

                                <ResumoCard
                                    titulo="Líquido"
                                    icone="bi-wallet2"
                                    valor={`R$ ${valorLiquido.toFixed(2)}`}
                                    cor="success"
                                />

                            </div>

                            <table className="table table-striped table-hover align-middle">

                                <thead
                                    style={{
                                        background: "#f8fafc"
                                    }}
                                >

                                    <tr>

                                        <th>Data</th>

                                        <th>Entrada</th>

                                        <th>Saída</th>

                                        <th>Horas</th>

                                        <th>Horas Extras</th>

                                        <th>Valor Hora</th>

                                        <th>Valor Dia</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {itens.map(item => (

                                        <tr key={item.id}>

                                            <td>

                                                {formatarData(item.data)}

                                            </td>

                                            <td>{item.entrada}</td>

                                            <td>{item.saida}</td>

                                            <td>{item.horas}</td>

                                            <td>{item.horas_extras ?? 0}</td>

                                            <td>

                                                R$ {Number(item.valor_hora).toFixed(2)}

                                            </td>

                                            <td>

                                                R$ {Number(item.valor_dia).toFixed(2)}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>


                            <div className="card border-0 shadow-sm mt-4">

                                <div className="card-body">

                                    <h5 className="fw-bold mb-4">

                                        <i className="bi bi-receipt-cutoff me-2 text-primary"></i>

                                        Resumo Financeiro

                                    </h5>

                                    <div className="d-flex justify-content-between py-2">

                                        <span className="text-muted">

                                            Valor Bruto

                                        </span>

                                        <strong>

                                            {valorBruto.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL"
                                                }
                                            )}

                                        </strong>

                                    </div>

                                    <div className="d-flex justify-content-between py-2">

                                        <span className="text-muted">

                                            Adiantamentos

                                        </span>

                                        <strong className="text-danger">

                                            - {adiantamentos.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL"
                                                }
                                            )}

                                        </strong>

                                    </div>

                                    <div className="d-flex justify-content-between py-2">

                                        <span className="text-muted">

                                            Descontos

                                        </span>

                                        <strong>

                                            R$ 0,00

                                        </strong>

                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <div className="text-muted">

                                                Valor Líquido a Receber

                                            </div>

                                            <small className="text-muted">

                                                Valor final do demonstrativo

                                            </small>

                                        </div>

                                        <h2 className="fw-bold text-success mb-0">

                                            {valorLiquido.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL"
                                                }
                                            )}

                                        </h2>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="modal-footer">

                            <button

                                className="btn btn-secondary"

                                onClick={onClose}

                            >

                                Fechar

                            </button>

                            <button

                                className="btn btn-primary"

                                onClick={() => gerarPdfDemonstrativo(demonstrativo)}

                            >

                                <i className="bi bi-file-earmark-pdf me-2"></i>

                                Visualizar PDF

                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </>

    );

}

function formatarData(data) {

    if (!data) return "-";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;

}

function ResumoCard({

    titulo,

    valor,

    cor,

    icone

}) {

    return (

        <div className="col-lg-3 col-md-6">

            <div
                className={`card border-${cor} shadow-sm h-100`}
            >

                <div className="card-body text-center py-4">

                    <i
                        className={`bi ${icone} text-${cor} fs-3`}
                    />

                    <div
                        className="text-muted small mt-2"
                    >

                        {titulo}

                    </div>

                    <h3
                        className={`fw-bold text-${cor} mt-2 mb-0`}
                    >

                        {valor}

                    </h3>

                </div>

            </div>

        </div>

    );

}