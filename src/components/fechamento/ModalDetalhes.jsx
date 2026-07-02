import React from 'react'

export default function ModalDetalhes({

    funcionario,

    onFechar

}) {

    if (!funcionario)

        return null

    return (

        <div

            className="modal d-block"

            style={{

                background:

                    'rgba(0,0,0,.45)'

            }}

        >

            <div className="modal-dialog modal-xl">

                <div className="modal-content">

                    <div className="modal-header">

                        <h4>

                            👤 {funcionario.nome}

                        </h4>

                        <button

                            className="btn-close"

                            onClick={onFechar}

                        />

                    </div>

                    <div className="modal-body">

                        <div className="row text-center mb-4">

                            <div className="col">

                                <small>

                                    Horas

                                </small>

                                <h4>

                                    {funcionario.horas.toFixed(2)}

                                </h4>

                            </div>

                            <div className="col">

                                <small>

                                    Valor Hora

                                </small>

                                <h4>

                                    R$

                                    {

                                        funcionario.valor_hora.toFixed(2)

                                    }

                                </h4>

                            </div>

                            <div className="col">

                                <small>

                                    Líquido

                                </small>

                                <h4 className="text-success">

                                    R$

                                    {

                                        funcionario.valor_liquido.toFixed(2)

                                    }

                                </h4>

                            </div>

                        </div>

                        <hr />

                        <h5>

                            🏪 Horas por Loja

                        </h5>

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>Loja</th>

                                    <th>Horas</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    funcionario.resumo_lojas.map(

                                        loja => (

                                            <tr key={loja.id}>

                                                <td>

                                                    {loja.nome}

                                                </td>

                                                <td>

                                                    {

                                                        loja.horas.toFixed(2)

                                                    }

                                                </td>

                                            </tr>

                                        )

                                    )

                                }

                            </tbody>

                        </table>

                        <hr />

                        <h5>

                            💵 Adiantamentos

                        </h5>

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>Data</th>

                                    <th>Valor</th>

                                    <th>Observação</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    funcionario.adiantamentos.registros.map(

                                        ad => (

                                            <tr key={ad.id}>

                                                <td>

                                                    {ad.data}

                                                </td>

                                                <td>

                                                    R$

                                                    {

                                                        Number(

                                                            ad.valor

                                                        ).toFixed(2)

                                                    }

                                                </td>

                                                <td>

                                                    {ad.observacao}

                                                </td>

                                            </tr>

                                        )

                                    )

                                }

                            </tbody>

                        </table>

                        <hr />

                        <h5>

                            🕒 Pontos Utilizados

                        </h5>

                        <div className="d-none d-md-block">

                            <table className="table table-sm">

                                <thead>

                                    <tr>

                                        <th>Data</th>

                                        <th>Loja</th>

                                        <th>Entrada</th>

                                        <th>Saída Almoço</th>

                                        <th>Retorno</th>

                                        <th>Saída</th>

                                        <th>Horas</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        funcionario.pontos.map(

                                            ponto => (

                                                <tr key={ponto.id}>

                                                    <td>{ponto.data}</td>

                                                    <td>{ponto.loja}</td>

                                                    <td>{ponto.entrada?.slice(0, 5)}</td>

                                                    <td>{ponto.saida_almoco?.slice(0, 5)}</td>

                                                    <td>{ponto.retorno_almoco?.slice(0, 5)}</td>

                                                    <td>{ponto.saida?.slice(0, 5)}</td>

                                                    <td>{Number(ponto.horas).toFixed(2)}</td>

                                                </tr>

                                            )

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                        <div className="d-md-none">

                            {

                                funcionario.pontos.map(

                                    ponto => (

                                        <div

                                            key={ponto.id}

                                            className="card-app mt-3"

                                        >

                                            <div className="d-flex justify-content-between">

                                                <strong>

                                                    📅 {new Date(
                                                        ponto.data + 'T00:00:00'
                                                    ).toLocaleDateString('pt-BR')}

                                                </strong>

                                                {(() => {

                                                    const horas = Number(ponto.horas)

                                                    const extras = Math.max(0, horas - 8)

                                                    return (

                                                        <div className="text-end">

                                                            <span

                                                                className={

                                                                    `badge ${extras > 0

                                                                        ? 'bg-warning text-dark'

                                                                        : 'bg-primary'

                                                                    }`

                                                                }

                                                            >

                                                                {horas.toFixed(2)} h

                                                            </span>

                                                            {

                                                                extras > 0 &&

                                                                <div
                                                                    className="small text-warning fw-bold mt-1"
                                                                >

                                                                    +{extras.toFixed(2)} h extra

                                                                </div>

                                                            }

                                                        </div>

                                                    )

                                                })()}

                                            </div>

                                            <hr />

                                            <div className="row">

                                                <div className="col-6">

                                                    <small className="text-muted">

                                                        Entrada

                                                    </small>

                                                    <div>

                                                        {ponto.entrada?.slice(0, 5)}

                                                    </div>

                                                </div>

                                                <div className="col-6">

                                                    <small className="text-muted">

                                                        Saída

                                                    </small>

                                                    <div>

                                                        {ponto.saida?.slice(0, 5)}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="row mt-2">

                                                <div className="col-6">

                                                    <small className="text-muted small">

                                                        Saída Almoço

                                                    </small>

                                                    <div>

                                                        {ponto.saida_almoco?.slice(0, 5)}

                                                    </div>

                                                </div>

                                                <div className="col-6">

                                                    <small className="text-muted">

                                                        Retorno

                                                    </small>

                                                    <div>

                                                        {ponto.retorno_almoco?.slice(0, 5)}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="mt-3">

                                                <div className="mt-3 fw-semibold">

                                                    🏪 {ponto.loja}

                                                </div>

                                            </div>

                                        </div>

                                    )

                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )

}