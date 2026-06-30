import {
    useNavigate,
    useParams
}
    from 'react-router-dom'

import {
    ArrowLeft
}
    from 'lucide-react'



import Layout
    from '../components/Layout'



import {
    useEffect,
    useState
}
    from 'preact/hooks'

import {

    buscarPontoPorId,

    excluirPonto,

    atualizarPonto,

    listarPontosFuncionarioData

}
    from '../services/pontos'

function converterMinutos(
    hora
) {

    const [
        h,
        m
    ] = hora
        .split(':')

    return (

        Number(h) * 60 +

        Number(m)

    )

}
function existeConflitoHorario(

    novoInicio,

    novoFim,

    pontosExistentes,

    pontoAtualId

) {

    const inicioNovo =

        converterMinutos(
            novoInicio
        )

    const fimNovo =

        converterMinutos(
            novoFim
        )

    return pontosExistentes.some(

        ponto => {

            if (
                ponto.id ===
                pontoAtualId
            )
                return false

            const inicioExistente =

                converterMinutos(
                    ponto.entrada
                )

            const fimExistente =

                converterMinutos(
                    ponto.saida
                )

            return (

                inicioNovo <
                fimExistente

                &&

                fimNovo >
                inicioExistente

            )

        }

    )

}

export default function DetalhePonto() {

    const {
        id
    } = useParams()

    const navigate =
        useNavigate()

    const [
        ponto,
        setPonto
    ] = useState(null)

    const [
        modalExcluirAberto,
        setModalExcluirAberto
    ] = useState(false)

    const [
        pontoEditando,
        setPontoEditando
    ] = useState(null)

    useEffect(() => {

        carregar()

    }, [])

    async function carregar() {

        try {

            const dados =

                await buscarPontoPorId(
                    id
                )

            setPonto(
                dados
            )

        }

        catch (erro) {

            console.error(
                erro
            )

        }

    }

    async function excluir() {

        const confirmar =

            window.confirm(

                'Esta ação é definitiva. Deseja realmente excluir este ponto?'

            )

        if (!confirmar)
            return

        try {

            await excluirPonto(
                ponto.id
            )

            alert(
                'Ponto excluído com sucesso.'
            )

            navigate(
                '/ponto'
            )

        }

        catch (erro) {

            console.error(
                erro
            )

            alert(
                'Erro ao excluir.'
            )

        }

    }

    async function salvarEdicao() {

        try {

            const entrada =
                pontoEditando.entrada

            const saida =
                pontoEditando.saida

            const [
                hEntrada,
                mEntrada
            ] = entrada.split(':')

            const [
                hSaida,
                mSaida
            ] = saida.split(':')

            const inicio =

                Number(hEntrada) * 60 +

                Number(mEntrada)

            const fim =

                Number(hSaida) * 60 +

                Number(mSaida)

            const horas =

                (
                    fim - inicio
                ) / 60

            const pontosExistentes =

                await listarPontosFuncionarioData(

                    ponto.funcionario_id,

                    ponto.data

                )

            const conflito =

                existeConflitoHorario(

                    pontoEditando.entrada,

                    pontoEditando.saida,

                    pontosExistentes,

                    ponto.id

                )

            if (conflito) {

                alert(

                    'Conflito de jornada detectado.'

                )

                return

            }

            await atualizarPonto(

                pontoEditando.id,

                {

                    entrada:
                        pontoEditando.entrada,

                    saida_almoco:
                        pontoEditando.saida_almoco,

                    retorno_almoco:
                        pontoEditando.retorno_almoco,

                    saida:
                        pontoEditando.saida,

                    horas:
                        horas

                }

            )

            alert(
                'Ponto atualizado com sucesso.'
            )

            setPontoEditando(
                null
            )

            await carregar()

        }

        catch (erro) {

            console.error(
                erro
            )

            alert(
                'Erro ao atualizar ponto.'
            )

        }

    }

    if (!ponto)

        return (

            <Layout>

                Carregando...

            </Layout>

        )

    return (

        <Layout>

            <div
                className="d-flex align-items-center mb-3"
            >

                <button

                    className="btn btn-link p-0 me-2"

                    onClick={() =>

                        navigate(
                            '/ponto'
                        )

                    }

                >

                    <ArrowLeft
                        size={24}
                    />

                </button>

                <h4
                    className="mb-0"
                >

                    {
                        ponto.funcionarios?.nome
                    }

                </h4>

            </div>

            <div
                className="card-app mt-4"
            >

                

                <hr />

                <p>

                    <strong>

                        Loja:

                    </strong>

                    {' '}

                    {
                        ponto.loja
                    }

                </p>

                <p>

                    <strong>

                        Data:

                    </strong>

                    {' '}

                    {
                        ponto.data
                    }

                </p>

                <p>

                    <strong>

                        Escala:

                    </strong>

                    {' '}

                    {
                        ponto.escala
                    }

                </p>

                <p>

                    <strong>

                        Entrada:

                    </strong>

                    {' '}

                    {
                        ponto.entrada
                    }

                </p>

                <p>

                    <strong>

                        Saída almoço:

                    </strong>

                    {' '}

                    {
                        ponto.saida_almoco
                    }

                </p>

                <p>

                    <strong>

                        Retorno:

                    </strong>

                    {' '}

                    {
                        ponto.retorno_almoco
                    }

                </p>

                <p>

                    <strong>

                        Saída:

                    </strong>

                    {' '}

                    {
                        ponto.saida
                    }

                </p>

                <p>

                    <strong>

                        Horas:

                    </strong>

                    {' '}

                    {
                        ponto.horas
                    }

                </p>

                <div
                    className="d-flex gap-2 mt-4"
                >

                    <button

                        className="btn btn-primary"

                        onClick={() =>

                            setPontoEditando(
                                ponto
                            )

                        }

                    >

                        Editar

                    </button>

                    <button

                        className="btn btn-danger"

                        onClick={excluir}

                    >

                        Excluir

                    </button>

                </div>

            </div>

            {
                pontoEditando && (

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                    >

                        <div className="modal-dialog">

                            <div className="modal-content">

                                <div className="modal-header">

                                    <h5>
                                        Editar Ponto
                                    </h5>

                                    <button

                                        className="btn-close"

                                        onClick={() =>

                                            setPontoEditando(
                                                null
                                            )

                                        }

                                    />

                                </div>

                                <div className="modal-body">

                                    <div className="mb-3">

                                        <label>
                                            Entrada
                                        </label>

                                        <input

                                            type="time"

                                            className="form-control"

                                            value={
                                                pontoEditando.entrada?.substring(0, 5)
                                            }

                                            onChange={e =>

                                                setPontoEditando({

                                                    ...pontoEditando,

                                                    entrada:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>
                                            Saída Almoço
                                        </label>

                                        <input

                                            type="time"

                                            className="form-control"

                                            value={
                                                pontoEditando.saida_almoco?.substring(0, 5)
                                            }

                                            onChange={e =>

                                                setPontoEditando({

                                                    ...pontoEditando,

                                                    saida_almoco:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>
                                            Retorno
                                        </label>

                                        <input

                                            type="time"

                                            className="form-control"

                                            value={
                                                pontoEditando.retorno_almoco?.substring(0, 5)
                                            }

                                            onChange={e =>

                                                setPontoEditando({

                                                    ...pontoEditando,

                                                    retorno_almoco:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>
                                            Saída
                                        </label>

                                        <input

                                            type="time"

                                            className="form-control"

                                            value={
                                                pontoEditando.saida?.substring(0, 5)
                                            }

                                            onChange={e =>

                                                setPontoEditando({

                                                    ...pontoEditando,

                                                    saida:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button

                                        className="btn btn-secondary"

                                        onClick={() =>

                                            setPontoEditando(
                                                null
                                            )

                                        }

                                    >

                                        Cancelar

                                    </button>

                                    <button

                                        className="btn btn-primary"

                                        onClick={salvarEdicao}

                                    >

                                        Salvar

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }

        </Layout>

    )

}