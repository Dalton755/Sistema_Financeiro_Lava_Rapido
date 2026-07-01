import { useEffect, useState } from 'preact/hooks'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import HistoricoStatus
    from '../components/HistoricoStatus'
import HistoricoFiltros
    from '../components/HistoricoFiltros'

import { listarHistoricoPagamentos }
    from '../services/pagamentos'

export default function HistoricoFechamentos() {

    const [fechamentos, setFechamentos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [aba, setAba] = useState('fechamentos')
    const [pagamentosHistorico, setPagamentosHistorico] = useState([])

    useEffect(() => {

        carregar()

    }, [])

    async function carregar() {

        const { data, error } = await supabase

            .schema('financeiro')

            .from('fechamentos')
            .select(`
                *,
                lojas (
                nome
                ),
                funcionarios (
                nome
                )
            `)

            .order('created_at', { ascending: false })

        if (error) {

            console.error(error)

        } else {

            setFechamentos(data)

        }

        setCarregando(false)

        const pagamentos =

            await listarHistoricoPagamentos()

        setPagamentosHistorico(

            pagamentos

        )

    }

    function formatarCompetencia(

        competencia,

        quinzena

    ) {

        const meses = [

            'Janeiro',

            'Fevereiro',

            'Março',

            'Abril',

            'Maio',

            'Junho',

            'Julho',

            'Agosto',

            'Setembro',

            'Outubro',

            'Novembro',

            'Dezembro'

        ]

        const [

            ano,

            mes

        ] = competencia

            .split('-')

        return `${meses[Number(mes) - 1]

            } / ${ano

            } • ${quinzena

            }ª Quinzena`

    }

    return (

        <Layout>

            <h2>

                Central de Histórico

            </h2>

            <div

                className="d-flex gap-2 mb-4"

            >

                <button

                    className={

                        aba === 'fechamentos'

                            ? 'btn btn-primary'

                            : 'btn btn-outline-primary'

                    }

                    onClick={() =>

                        setAba(

                            'fechamentos'

                        )

                    }

                >

                    Fechamentos

                </button>

                <button

                    className={

                        aba === 'pagamentos'

                            ? 'btn btn-primary'

                            : 'btn btn-outline-primary'

                    }

                    onClick={() =>

                        setAba(

                            'pagamentos'

                        )

                    }

                >

                    Pagamentos

                </button>

                <button

                    className={

                        aba === 'adiantamentos'

                            ? 'btn btn-primary'

                            : 'btn btn-outline-primary'

                    }

                    onClick={() =>

                        setAba(

                            'adiantamentos'

                        )

                    }

                >

                    Adiantamentos

                </button>

            </div>

            <hr />

            <HistoricoFiltros />

            {

                aba === 'pagamentos'

                &&

                (

                    <div className="card-app">

                        <h4>

                            Histórico de Pagamentos

                        </h4>

                        <hr />

                        <p>

                            {

                                pagamentosHistorico.length === 0

                                    ? (

                                        <div className="card-app">

                                            Nenhum pagamento encontrado.

                                        </div>

                                    )

                                    : (

                                        pagamentosHistorico.map(

                                            pagamento => (

                                                <div

                                                    key={pagamento.id}

                                                    className="card-app mb-3"

                                                >

                                                    <h5>

                                                        {

                                                            pagamento.funcionarios?.nome

                                                        }

                                                    </h5>

                                                    <small>

                                                        {

                                                            pagamento.lojas?.nome

                                                        }

                                                    </small>

                                                    <hr />

                                                    <div>

                                                        Competência:

                                                        {' '}

                                                        {

                                                            pagamento.competencia

                                                        }

                                                    </div>

                                                    <div>

                                                        Quinzena:

                                                        {' '}

                                                        {

                                                            pagamento.quinzena

                                                        }

                                                    </div>

                                                    <div>

                                                        Forma:

                                                        {' '}

                                                        {

                                                            pagamento.forma_pagamento

                                                        }

                                                    </div>

                                                    <div>

                                                        Valor:

                                                        {' '}

                                                        <strong>

                                                            R$

                                                            {

                                                                Number(

                                                                    pagamento.valor

                                                                ).toFixed(2)

                                                            }

                                                        </strong>

                                                    </div>

                                                    <div>

                                                        Data:

                                                        {' '}

                                                        {

                                                            pagamento.data_pagamento

                                                        }

                                                    </div>

                                                </div>

                                            )

                                        )

                                    )

                            }

                        </p>



                    </div>



                )



            }

            {

                aba === 'adiantamentos'

                &&

                (

                    <div className="card-app">

                        <h4>

                            Histórico de Adiantamentos

                        </h4>

                        <hr />

                        <p>

                            Em desenvolvimento.

                        </p>

                    </div>

                )

            }

            {

                carregando

                    ?

                    <div className="card-app">

                        Carregando...

                    </div>

                    :

                    aba === 'fechamentos'

                    &&

                    fechamentos.map(fechamento => (

                        <div

                            key={fechamento.id}

                            className="card-app mb-3"

                        >

                            <div className="mb-3">

                                <h3 className="mb-1">

                                    {

                                        fechamento.tipo === 'LOJA'

                                            ? fechamento.lojas?.nome

                                            : fechamento.funcionarios?.nome

                                    }

                                </h3>

                                <small className="text-muted">

                                    {

                                        fechamento.tipo === 'LOJA'

                                            ? 'Fechamento por Loja'

                                            : 'Fechamento Individual'

                                    }

                                </small>

                            </div>

                            <hr />

                            <p className="text-muted">

                                {

                                    formatarCompetencia(

                                        fechamento.competencia,

                                        fechamento.quinzena

                                    )

                                }

                            </p>

                            <div>

                                <strong>

                                    Quinzena:

                                </strong>

                                {' '}

                                {fechamento.quinzena}

                            </div>

                            <div>

                                <strong>

                                    Loja:

                                </strong>

                                {' '}

                                {

                                    fechamento.lojas?.nome ||

                                    '-'

                                }

                            </div>

                            <div>

                                <strong>

                                    Funcionários:

                                </strong>

                                {' '}

                                {

                                    fechamento.total_funcionarios

                                }

                            </div>

                            <div className="mt-3 mb-3">

                                <HistoricoStatus

                                    status={

                                        fechamento.status

                                    }

                                />

                            </div>

                            <div className="row mt-3">

                                <div className="col">

                                    <small>

                                        Bruto

                                    </small>

                                    <h5>

                                        R$

                                        {

                                            Number(

                                                fechamento.valor_bruto

                                            ).toFixed(2)

                                        }

                                    </h5>

                                </div>

                                <div className="col">

                                    <small>

                                        Líquido

                                    </small>

                                    <h5>

                                        R$

                                        {

                                            Number(

                                                fechamento.valor_liquido

                                            ).toFixed(2)

                                        }

                                    </h5>

                                </div>

                            </div>

                            <div className="mt-3">

                                <button

                                    className="btn btn-primary w-100 mt-4"

                                    onClick={() =>

                                        window.location.href =

                                        `/historico-fechamentos/${fechamento.id}`

                                    }

                                >

                                    🔍 Ver Detalhes

                                </button>

                            </div>

                        </div>



                    ))



            }



        </Layout>

    )

}