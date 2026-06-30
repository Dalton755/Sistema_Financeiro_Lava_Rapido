import { useEffect, useState } from 'preact/hooks'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function HistoricoFechamentos() {

    const [fechamentos, setFechamentos] = useState([])
    const [carregando, setCarregando] = useState(true)

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
                )
            `)

            .order('created_at', { ascending: false })

        if (error) {

            console.error(error)

        } else {

            setFechamentos(data)

        }

        setCarregando(false)

    }

    return (

        <Layout>

            <h2>

                Histórico de Fechamentos

            </h2>

            <hr />

            {

                carregando

                    ?

                    <div className="card-app">

                        Carregando...

                    </div>

                    :

                    fechamentos.map(fechamento => (

                        <div

                            key={fechamento.id}

                            className="card-app mb-3"

                        >

                            <h5>

                                {

                                    fechamento.tipo

                                }

                            </h5>

                            <hr />

                            <div>

                                <strong>

                                    Competência:

                                </strong>

                                {' '}

                                {fechamento.competencia}

                            </div>

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

                            <div>

                                <strong>

                                    Status:

                                </strong>

                                {' '}

                                {fechamento.status}

                            </div>

                            <div>

                                <strong>

                                    Bruto:

                                </strong>

                                {' '}

                                R$

                                {

                                    Number(

                                        fechamento.valor_bruto

                                    ).toFixed(2)

                                }

                            </div>

                            <div>

                                <strong>

                                    Líquido:

                                </strong>

                                {' '}

                                R$

                                {

                                    Number(

                                        fechamento.valor_liquido

                                    ).toFixed(2)

                                }

                            </div>

                            <div className="mt-3">

                                <button

                                    className="btn btn-primary"

                                    onClick={() =>

                                        window.location.href =

                                        `/historico-fechamentos/${fechamento.id}`

                                    }

                                >

                                    Ver Detalhes

                                </button>

                            </div>

                        </div>

                    ))

            }

        </Layout>

    )

}