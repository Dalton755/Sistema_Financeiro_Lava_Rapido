import { useEffect, useState } from 'preact/hooks'
import { useParams } from 'react-router-dom'

import Layout from '../components/Layout'

import {

    buscarFechamentoPorId,

    listarItensFechamento

}

    from '../repositories/fechamentoRepository'

import {

    listarPontosPorFechamento

}

    from '../repositories/pontoRepository'

import {

    listarAdiantamentosPorFechamento

}

    from '../repositories/adiantamentoRepository'






export default function DetalheFechamento() {

    const { id } = useParams()

    const [

        fechamento,

        setFechamento

    ] = useState(null)


    const [

        itens,

        setItens

    ] = useState([])


    const [

        pontos,

        setPontos

    ] = useState([])

    const [

        adiantamentos,

        setAdiantamentos

    ] = useState([])






    async function carregar() {

        const {

            data,

            error

        } = await buscarFechamentoPorId(id)

        if (error)

            throw error

        setFechamento(data)

        const {

            data: listaItens,

            error: erroItens

        } = await listarItensFechamento(id)

        if (erroItens)

            throw erroItens

        setItens(listaItens)

        const {

            data: listaPontos,

            error: erroPontos

        } = await listarPontosPorFechamento(id)

        if (erroPontos)

            throw erroPontos

        setPontos(listaPontos)

        const {

            data: listaAdiantamentos,

            error: erroAdiantamentos

        } = await listarAdiantamentosPorFechamento(id)

        if (erroAdiantamentos)

            throw erroAdiantamentos

        setAdiantamentos(

            listaAdiantamentos

        )

    }

    useEffect(() => {

        carregar()

    }, [])

    if (!fechamento) {

        return (

            <Layout>

                Carregando...

            </Layout>

        )

    }

    return (

        <Layout>

            <h2>

                Detalhe do Fechamento

            </h2>

            <hr />

            <div className="card-app p-4">

                <h4>

                    {

                        fechamento.tipo

                    }

                </h4>

                <br />

                <strong>

                    Competência:

                </strong>

                {' '}

                {

                    fechamento.competencia

                }

                <br />

                <strong>

                    Quinzena:

                </strong>

                {' '}

                {

                    fechamento.quinzena

                }

                <br />

                <strong>

                    Status:

                </strong>

                {' '}

                {

                    fechamento.status

                }

                <br />

                <strong>

                    Bruto:

                </strong>

                {' '}

                R$

                {

                    fechamento.valor_bruto

                }

                <br />

                <strong>

                    Líquido:

                </strong>

                {' '}

                R$

                {

                    fechamento.valor_liquido

                }

                <br />

                <br />

                {

                    fechamento.tipo === 'LOJA'

                        ?

                        <>

                            <strong>

                                Loja

                            </strong>

                            <br />

                            {

                                fechamento.lojas?.nome

                            }

                        </>

                        :

                        <>

                            <strong>

                                Funcionário

                            </strong>

                            <br />

                            {

                                fechamento.funcionarios?.nome

                            }

                        </>

                }

            </div>

            <div className="card-app mt-3 p-4">

                <h4>

                    Funcionários

                </h4>

                <hr />

                {

                    itens.map(item => (

                        <div

                            key={item.id}

                            className="mb-4"

                        >

                            <strong>

                                {

                                    item.funcionarios?.nome

                                }

                            </strong>

                            <br />

                            {(() => {

                                const pontosFuncionario =

                                    pontos.filter(

                                        ponto =>

                                            ponto.funcionario_id ===

                                            item.funcionario_id

                                    )

                                const diasTrabalhados =

                                    new Set(

                                        pontosFuncionario.map(

                                            ponto => ponto.data

                                        )

                                    ).size

                                const horasTrabalhadas =

                                    pontosFuncionario.reduce(

                                        (total, ponto) =>

                                            total +

                                            Number(ponto.horas),

                                        0

                                    )

                                const horasExtras =

                                    pontosFuncionario.reduce(

                                        (total, ponto) =>

                                            total +

                                            Math.max(

                                                0,

                                                Number(ponto.horas) - 8

                                            ),

                                        0

                                    )

                                return (

                                    <>

                                        <br />

                                        Escala:

                                        {' '}

                                        {

                                            pontosFuncionario[0]?.escala ||

                                            '-'

                                        }

                                        <br />

                                        Dias Trabalhados:

                                        {' '}

                                        {diasTrabalhados}

                                        <br />

                                        Horas Trabalhadas:

                                        {' '}

                                        {

                                            horasTrabalhadas.toFixed(2)

                                        }

                                        <br />

                                        Horas Extras:

                                        {' '}

                                        {

                                            horasExtras.toFixed(2)

                                        }

                                        <br />

                                        Valor Hora:

                                        {' '}

                                        R$

                                        {' '}

                                        {item.valor_hora}

                                        <br />

                                        Bruto:

                                        {' '}

                                        R$

                                        {' '}

                                        {item.valor_bruto}

                                        <br />

                                        Adiantamentos:

                                        {' '}

                                        R$

                                        {' '}

                                        {item.valor_adiantamentos}

                                        <br />

                                        Líquido:

                                        {' '}

                                        R$

                                        {' '}

                                        {item.valor_liquido}

                                    </>

                                )

                            })()}

                            <div className="mt-3">

                                <strong>

                                    Pontos Utilizados

                                </strong>

                            </div>

                            {

                                pontos

                                    .filter(

                                        ponto =>

                                            ponto.funcionario_id ===

                                            item.funcionario_id

                                    )

                                    .map(

                                        ponto => (

                                            <div
                                                key={ponto.id}
                                                className="card-app mt-3 p-3"
                                            >

                                                <div className="d-flex justify-content-between align-items-center mb-3">

                                                    <strong>

                                                        📅 {ponto.data}

                                                    </strong>

                                                    <span className="badge bg-primary">

                                                        {Number(ponto.horas).toFixed(2)} h

                                                    </span>

                                                </div>

                                                <div className="row">

                                                    <div className="col-6">

                                                        <small className="text-muted">

                                                            Entrada

                                                        </small>

                                                        <div>

                                                            {ponto.entrada?.slice(0, 5) || '-'}

                                                        </div>

                                                    </div>

                                                    <div className="col-6">

                                                        <small className="text-muted">

                                                            Saída

                                                        </small>

                                                        <div>

                                                            {ponto.saida?.slice(0, 5) || '-'}

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="row mt-3">

                                                    <div className="col-6">

                                                        <small className="text-muted">

                                                            Saída Almoço

                                                        </small>

                                                        <div>

                                                            {ponto.saida_almoco?.slice(0, 5) || '-'}

                                                        </div>

                                                    </div>

                                                    <div className="col-6">

                                                        <small className="text-muted">

                                                            Retorno

                                                        </small>

                                                        <div>

                                                            {ponto.retorno_almoco?.slice(0, 5) || '-'}

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        )

                                    )

                            }

                            <div className="mt-3">

                                <strong>

                                    Adiantamentos Utilizados

                                </strong>

                            </div>

                            {

                                adiantamentos

                                    .filter(

                                        adiantamento =>

                                            adiantamento.funcionario_id ===

                                            item.funcionario_id

                                    )

                                    .length === 0

                                    ?

                                    (

                                        <div className="text-muted">

                                            Nenhum adiantamento utilizado.

                                        </div>

                                    )

                                    :

                                    (

                                        adiantamentos

                                            .filter(

                                                adiantamento =>

                                                    adiantamento.funcionario_id ===

                                                    item.funcionario_id

                                            )

                                            .map(

                                                adiantamento => (

                                                    <div

                                                        key={adiantamento.id}

                                                        className="border rounded p-2 mt-2"

                                                    >

                                                        <strong>

                                                            {adiantamento.data}

                                                        </strong>

                                                        <br />

                                                        Valor:

                                                        {' '}

                                                        R$

                                                        {

                                                            Number(

                                                                adiantamento.valor

                                                            ).toFixed(2)

                                                        }

                                                        <br />

                                                        Observação:

                                                        {' '}

                                                        {

                                                            adiantamento.observacao ||

                                                            '-'

                                                        }

                                                    </div>

                                                )

                                            )

                                    )

                            }

                            <hr />

                        </div>

                    ))

                }

            </div>

        </Layout>

    )

}