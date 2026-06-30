import Layout
    from '../components/Layout'

import {
    useEffect,
    useState
}
    from 'preact/hooks'

import { supabase }
    from '../lib/supabase'

import {
    listarLojas,
    criarLoja,
    atualizarLoja
}
    from '../services/lojas'

import {
    Building2,
    Plus,
    Pencil,
    Trash2
}
    from 'lucide-react'

export default function Configuracoes() {

    const [
        lojas,
        setLojas
    ] = useState([])

    const [
        modalAberto,
        setModalAberto
    ] = useState(false)

    const [
        novaLoja,
        setNovaLoja
    ] = useState('')

    const [
        verTodas,
        setVerTodas
    ] = useState(
        false
    )

    useEffect(() => {

        carregar()

    }, [verTodas])

    async function carregar() {

        const dados =
            await listarLojas()

        if (verTodas) {

            setLojas(
                dados
            )

            return
        }

        setLojas(

            dados.filter(
                loja =>
                    loja.status ===
                    'Ativa'
            )

        )

    }

    async function salvarLoja() {

        if (!novaLoja.trim()) {

            alert(
                'Informe o nome da loja.'
            )

            return
        }

        await criarLoja({

            nome: novaLoja,

            status: 'Ativa'

        })

        setNovaLoja('')

        setModalAberto(false)

        await carregar()

    }

    async function desativar(id) {

        if (
            !confirm(
                'Desativar esta loja?'
            )
        )
            return

        await atualizarLoja(
            id,
            {
                status: 'Inativa'
            }
        )

        await carregar()

    }

    return (

        <Layout>

            <div className="mb-4">

                <h1 className="page-title">
                    Configurações
                </h1>

                <p className="page-subtitle">
                    Gestão de lojas
                </p>

            </div>

            <div className="card-app mb-4">

                <button
                    className="btn btn-app"
                    onClick={() =>
                        setModalAberto(
                            true
                        )
                    }
                >

                    <Plus size={18} />

                    Nova Loja

                </button>

                <div
                    className="text-center mt-2 mb-4"
                >

                    <small

                        style={{
                            cursor: 'pointer'
                        }}

                        onClick={() =>
                            setVerTodas(
                                !verTodas
                            )
                        }

                    >

                        {

                            verTodas

                                ? 'Mostrar apenas ativas'

                                : 'Ver todas'

                        }

                    </small>

                </div>

            </div>

            <div className="row">

                {

                    lojas.map(
                        loja => (

                            <div
                                className="col-md-4 mb-4"
                                key={loja.id}
                            >

                                <div
                                    className="card-app"
                                >

                                    <Building2
                                        size={40}
                                        className="mb-3"
                                    />

                                    <h4>
                                        {loja.nome}
                                    </h4>

                                    <div
                                        className="mt-3 mb-3"
                                    >

                                        <span
                                            className={
                                                loja.status === 'Ativa'
                                                    ? 'badge bg-success'
                                                    : 'badge bg-secondary'
                                            }
                                        >

                                            {loja.status}

                                        </span>

                                    </div>

                                    <div
                                        className="d-flex gap-2 justify-content-center"
                                    >

                                        <button
                                            className="btn btn-outline-primary"
                                        >

                                            <Pencil size={16} />

                                        </button>

                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() =>
                                                desativar(
                                                    loja.id
                                                )
                                            }
                                        >

                                            <Trash2 size={16} />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )

                }

            </div>

            {

                modalAberto && (

                    <div
                        className="modal fade show d-block"
                        style={{
                            background:
                                'rgba(0,0,0,.5)'
                        }}
                    >

                        <div
                            className="modal-dialog"
                        >

                            <div
                                className="modal-content"
                            >

                                <div
                                    className="modal-header"
                                >

                                    <h5>
                                        Nova Loja
                                    </h5>

                                </div>

                                <div
                                    className="modal-body"
                                >

                                    <input
                                        className="form-control"
                                        placeholder="Nome da loja"
                                        value={novaLoja}
                                        onInput={e =>
                                            setNovaLoja(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div
                                    className="modal-footer"
                                >

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setModalAberto(
                                                false
                                            )
                                        }
                                    >

                                        Cancelar

                                    </button>

                                    <button
                                        className="btn btn-app"
                                        onClick={
                                            salvarLoja
                                        }
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