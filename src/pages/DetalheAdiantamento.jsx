import {
    useEffect,
    useState
}
    from 'preact/hooks'

import {
    useNavigate,
    useParams
}
    from 'react-router-dom'

import Layout
    from '../components/Layout'

import {
    ArrowLeft
}
    from 'lucide-react'

import {

    buscarAdiantamentoPorId,

    excluirAdiantamento,

    atualizarAdiantamento

}
    from '../services/adiantamentos'

export default function DetalheAdiantamento() {

    const {
        id
    } = useParams()

    const navigate =
        useNavigate()

    const [
        adiantamento,
        setAdiantamento
    ] = useState(null)

    const [
        adiantamentoEditando,
        setAdiantamentoEditando
    ] = useState(null)

    useEffect(() => {

        carregar()

    }, [])

    async function carregar() {

        try {

            const dados =

                await buscarAdiantamentoPorId(
                    id
                )

            setAdiantamento(
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

        if (

            adiantamento.status ===

            'Compensado'

        ) {

            alert(

                'Este adiantamento já foi compensado e não pode ser excluído.'

            )

            return

        }

        const confirmar =

            window.confirm(

                'Esta ação é definitiva. Deseja realmente excluir este adiantamento?'

            )

        if (!confirmar)
            return

        try {

            await excluirAdiantamento(
                adiantamento.id
            )

            alert(
                'Adiantamento excluído com sucesso.'
            )

            navigate(
                '/adiantamentos'
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

            if (

                !adiantamentoEditando.valor ||

                Number(
                    adiantamentoEditando.valor
                ) <= 0

            ) {

                alert(
                    'Informe um valor válido.'
                )

                return

            }

            await atualizarAdiantamento(

                adiantamentoEditando.id,

                {

                    data:
                        adiantamentoEditando.data,

                    valor:
                        Number(
                            adiantamentoEditando.valor
                        ),

                    observacao:
                        adiantamentoEditando.observacao,

                    status:
                        adiantamentoEditando.status

                }

            )

            alert(
                'Adiantamento atualizado com sucesso.'
            )

            setAdiantamentoEditando(
                null
            )

            await carregar()

        }

        catch (erro) {

            console.error(
                erro
            )

            alert(
                'Erro ao atualizar.'
            )

        }

    }

    if (!adiantamento)



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
                            '/adiantamentos'
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
                        adiantamento.funcionarios?.nome
                    }

                </h4>

            </div>

            <div
                className="card-app"
            >

                <p>

                    <strong>

                        Data:

                    </strong>

                    {' '}

                    {
                        adiantamento.data
                    }

                </p>

                <p>

                    <strong>

                        Valor:

                    </strong>

                    {' '}

                    R$

                    {
                        Number(
                            adiantamento.valor
                        ).toFixed(2)
                    }

                </p>

                <p>

                    <strong>

                        Observação:

                    </strong>

                    {' '}

                    {
                        adiantamento.observacao ||
                        '-'
                    }

                </p>

                <p>

                    <strong>

                        Status:

                    </strong>

                    {' '}

                    {
                        adiantamento.status
                    }

                </p>

                <div
                    className="d-flex gap-2 mt-4"
                >

                    <button

                        className="btn btn-primary"

                        onClick={() =>

                            setAdiantamentoEditando(
                                adiantamento
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
                adiantamentoEditando && (

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                    >

                        <div className="modal-dialog">

                            <div className="modal-content">

                                <div className="modal-header">

                                    <h5>

                                        Editar Adiantamento

                                    </h5>

                                    <button

                                        className="btn-close"

                                        onClick={() =>

                                            setAdiantamentoEditando(
                                                null
                                            )

                                        }

                                    />

                                </div>

                                <div className="modal-body">

                                    <div className="mb-3">

                                        <label>

                                            Data

                                        </label>

                                        <input

                                            type="date"

                                            className="form-control"

                                            value={
                                                adiantamentoEditando.data
                                            }

                                            onChange={e =>

                                                setAdiantamentoEditando({

                                                    ...adiantamentoEditando,

                                                    data:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>

                                            Valor

                                        </label>

                                        <input

                                            type="number"

                                            step="0.01"

                                            className="form-control"

                                            value={
                                                adiantamentoEditando.valor
                                            }

                                            onChange={e =>

                                                setAdiantamentoEditando({

                                                    ...adiantamentoEditando,

                                                    valor:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>

                                            Observação

                                        </label>

                                        <textarea

                                            className="form-control"

                                            rows="3"

                                            value={
                                                adiantamentoEditando.observacao || ''
                                            }

                                            onChange={e =>

                                                setAdiantamentoEditando({

                                                    ...adiantamentoEditando,

                                                    observacao:
                                                        e.target.value

                                                })

                                            }

                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label>

                                            Status

                                        </label>

                                        <select

                                            className="form-select"

                                            value={
                                                adiantamentoEditando.status
                                            }

                                            onChange={e =>

                                                setAdiantamentoEditando({

                                                    ...adiantamentoEditando,

                                                    status:
                                                        e.target.value

                                                })

                                            }

                                        >

                                            <option value="Aberto">

                                                Aberto

                                            </option>

                                            <option value="Compensado">

                                                Compensado

                                            </option>

                                            <option value="Cancelado">

                                                Cancelado

                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button

                                        className="btn btn-secondary"

                                        onClick={() =>

                                            setAdiantamentoEditando(
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