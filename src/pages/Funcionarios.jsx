import Layout
    from '../components/Layout'

import {
    useEffect,
    useState
}
    from 'preact/hooks'

import {
    Users,
    Building2,
    UserCheck,
    Search,
    Plus,
    Pencil,
    Trash2
}
    from 'lucide-react'

import {
    listarFuncionarios,
    criarFuncionario,
    atualizarFuncionario,
    desativarFuncionario
}
    from '../services/funcionarios'

import {
    listarLojas
}
    from '../services/lojas'

function formatarCPF(valor) {

    return valor

        .replace(/\D/g, '')

        .replace(
            /(\d{3})(\d)/,
            '$1.$2'
        )

        .replace(
            /(\d{3})(\d)/,
            '$1.$2'
        )

        .replace(
            /(\d{3})(\d{1,2})$/,
            '$1-$2'
        )

}

function formatarTelefone(
    valor
) {

    valor = valor

        .replace(
            /\D/g,
            ''
        )

    valor = valor.replace(

        /^(\d{2})(\d)/,

        '($1) $2'

    )

    valor = valor.replace(

        /(\d{5})(\d)/,

        '$1-$2'

    )

    return valor

}

export default function Funcionarios() {

    const [
        funcionarios,
        setFuncionarios
    ] = useState([])

    const [
        lojas,
        setLojas
    ] = useState([])

    const [
        busca,
        setBusca
    ] = useState('')

    const [
        mostrarInativos,
        setMostrarInativos
    ] = useState(false)

    const [
        modalAberto,
        setModalAberto
    ] = useState(false)

    const [
        funcionarioEditando,
        setFuncionarioEditando
    ] = useState(null)

    const [
        erros,
        setErros
    ] = useState({})

    const [
        novoFuncionario,
        setNovoFuncionario
    ] = useState({

        nome: '',
        cpf: '',
        telefone: '',
        loja: '',
        loja_padrao_id: '',
        cargo: 'Lavador',
        valor_hora: 10,
        status: 'Ativo'

    })

    useEffect(() => {

        carregar()

    }, [])

    async function carregar() {

        try {

            const [
                dadosFuncionarios,
                dadosLojas
            ] = await Promise.all([

                listarFuncionarios(),

                listarLojas()

            ])

            setFuncionarios(
                dadosFuncionarios
            )

            setLojas(
                dadosLojas.filter(
                    loja =>
                        loja.status === 'Ativa'
                )
            )
            console.log(
                'LOJAS',
                dadosLojas
            )

        }

        catch (erro) {

            console.error(
                erro
            )

        }

    }

    function editarFuncionario(
        funcionario
    ) {

        setErros({})

        setFuncionarioEditando(
            funcionario
        )

        setNovoFuncionario({

            nome:
                funcionario.nome || '',

            cpf:
                funcionario.cpf || '',

            telefone:
                funcionario.telefone || '',

            loja:
                funcionario.loja || '',

            loja_padrao_id:
                funcionario.loja_padrao_id || '',

            cargo:
                funcionario.cargo || 'Lavador',

            valor_hora:
                funcionario.valor_hora || 10,

            status:
                funcionario.status || 'Ativo'

        })

        setModalAberto(
            true
        )

    }

    async function salvarFuncionario() {

        console.log(
            'SALVAR CLICADO'
        )

        const novosErros = {}

        if (!novoFuncionario.nome?.trim()) {

            novosErros.nome = true

        }

        if (!novoFuncionario.loja?.trim()) {

            novosErros.loja = true

        }

        if (!novoFuncionario.cargo?.trim()) {

            novosErros.cargo = true

        }

        setErros(
            novosErros
        )

        if (
            Object.keys(
                novosErros
            ).length > 0
        ) {

            alert(
                'Preencha os campos obrigatórios.'
            )

            return

        }

        try {

            if (funcionarioEditando) {

                await atualizarFuncionario(

                    funcionarioEditando.id,

                    {
                        ...novoFuncionario
                    }

                )

            }

            else {

                await criarFuncionario({

                    ...novoFuncionario,

                    status: 'Ativo'

                })

            }

            setModalAberto(
                false
            )

            setFuncionarioEditando(
                null
            )

            setNovoFuncionario({

                nome: '',
                cpf: '',
                telefone: '',
                loja: '',
                cargo: 'Lavador',
                valor_hora: 10,
                status: 'Ativo'

            })

            await carregar()

        }

        catch (erro) {

            console.error(
                erro
            )

            alert(
                'Erro ao salvar funcionário.'
            )

        }

    }
    async function desativarFuncionarioAtual() {

        if (!funcionarioEditando)
            return

        const confirmar = confirm(

            `Desativar ${funcionarioEditando.nome}?`

        )

        if (!confirmar)
            return

        try {

            await desativarFuncionario(

                funcionarioEditando.id

            )

            setModalAberto(false)

            setFuncionarioEditando(null)

            await carregar()

        }

        catch (erro) {

            console.error(erro)

            alert(
                'Erro ao desativar funcionário.'
            )

        }

    }

    const funcionariosFiltrados =

        funcionarios

            .filter(f => {

                if (
                    !mostrarInativos &&
                    f.status === 'Inativo'
                ) {

                    return false

                }

                return true

            })

            .filter(f =>

                `${f.nome}
       ${f.cargo}
       ${f.loja}
       ${f.cpf}`

                    .toLowerCase()

                    .includes(

                        busca.toLowerCase()

                    )

            )

    const totalFuncionarios =
        funcionarios.length

    const totalAtivos =
        funcionarios.filter(

            f => f.status === 'Ativo'

        ).length

    const totalLojas =
        new Set(

            funcionarios.map(
                f => f.loja
            )

        ).size

    return (

        <Layout>

            <div
                className="mb-4"
            >

                <h1
                    className="page-title"
                >
                    Funcionários
                </h1>

                <p
                    className="page-subtitle"
                >
                    Gestão de colaboradores
                </p>

            </div>

            <div
                className="row g-4 mb-4"
            >

                <div className="col-md-4">

                    <div className="card-app">

                        <Users size={28} />

                        <h6 className="mt-3">
                            Total Funcionários
                        </h6>

                        <h2>
                            {totalFuncionarios}
                        </h2>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card-app">

                        <UserCheck size={28} />

                        <h6 className="mt-3">
                            Ativos
                        </h6>

                        <h2>
                            {totalAtivos}
                        </h2>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card-app">

                        <Building2 size={28} />

                        <h6 className="mt-3">
                            Lojas
                        </h6>

                        <h2>
                            {totalLojas}
                        </h2>

                    </div>

                </div>

            </div>

            <div
                className="card-app mb-4"
            >

                <div
                    className="row align-items-center"
                >

                    <div
                        className="col-md-8 mb-3 mb-md-0"
                    >

                        <div
                            className="input-group"
                        >

                            <span
                                className="input-group-text"
                            >

                                <Search size={18} />

                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar funcionário..."
                                value={busca}
                                onInput={e =>
                                    setBusca(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div
                        className="col-md-4 text-md-end"
                    >

                        <button
                            className="btn btn-app"
                            onClick={() => {

                                setFuncionarioEditando(
                                    null
                                )

                                setNovoFuncionario({

                                    nome: '',
                                    cpf: '',
                                    telefone: '',
                                    loja: '',
                                    cargo: 'Lavador',
                                    valor_hora: 10,
                                    status: 'Ativo'

                                })

                                setErros({})

                                setModalAberto(
                                    true
                                )

                            }}
                        >

                            <Plus size={18} />

                            Novo Funcionário

                        </button>

                    </div>

                </div>

                <div
                    className="mt-3"
                >

                    <button

                        className="btn btn-link p-0"

                        style={{
                            fontSize: '14px'
                        }}

                        onClick={() =>

                            setMostrarInativos(

                                !mostrarInativos

                            )

                        }

                    >

                        {

                            mostrarInativos

                                ? 'Ocultar inativos'

                                : 'Ver todos'

                        }

                    </button>

                </div>

            </div>

            <div
                className="row"
            >

                {

                    funcionariosFiltrados.map(

                        funcionario => (

                            <div
                                className="col-md-4 mb-4"
                                key={funcionario.id}
                            >

                                <div

                                    className={`

                                        card-app h-100

                                        ${funcionario.status === 'Inativo'

                                            ? 'funcionario-inativo'

                                            : ''

                                        }

                                    `}

                                    style={{
                                        cursor: 'pointer'
                                    }}

                                    onClick={() =>
                                        editarFuncionario(
                                            funcionario
                                        )
                                    }

                                >

                                    <h5
                                        className="fw-bold mb-3"
                                    >
                                        {funcionario.nome}
                                    </h5>

                                    <p
                                        className="mb-1"
                                    >

                                        {
                                            funcionario.cargo
                                        }

                                    </p>

                                    <p
                                        className="text-secondary"
                                    >

                                        {funcionario.lojas?.nome}

                                    </p>

                                    <span
                                        className={
                                            funcionario.status === 'Ativo'
                                                ? 'badge bg-success'
                                                : 'badge bg-secondary'
                                        }
                                    >

                                        {
                                            funcionario.status
                                        }

                                    </span>




                                </div>

                            </div>

                        )

                    )

                }

            </div>

            {

                modalAberto && (

                    <div
                        className="modal d-block"
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

                                        {

                                            funcionarioEditando

                                                ? 'Editar Funcionário'

                                                : 'Novo Funcionário'

                                        }

                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() =>
                                            setModalAberto(false)
                                        }
                                    />

                                </div>

                                <div
                                    className="modal-body"
                                >

                                    <input
                                        className={`

                                            form-control mb-1

                                            ${erros.nome
                                                ? 'is-invalid'
                                                : ''
                                            }

                                        `}
                                        placeholder="Nome"

                                        value={
                                            novoFuncionario.nome
                                        }

                                        onInput={e =>

                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                nome:
                                                    e.target.value


                                            })

                                        }
                                    />

                                    {

                                        erros.nome && (

                                            <div
                                                className="invalid-feedback d-block mb-2"
                                            >

                                                Nome obrigatório

                                            </div>

                                        )

                                    }

                                    <input
                                        className="form-control mb-3"
                                        placeholder="CPF"

                                        value={
                                            novoFuncionario.cpf
                                        }

                                        onInput={e =>
                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                cpf:
                                                    formatarCPF(
                                                        e.target.value
                                                    )

                                            })
                                        }
                                    />

                                    <input
                                        className="form-control mb-3"
                                        placeholder="Telefone"

                                        value={
                                            novoFuncionario.telefone
                                        }

                                        onInput={e =>
                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                telefone:
                                                    formatarTelefone(
                                                        e.target.value
                                                    )

                                            })
                                        }
                                    />

                                    <select

                                        className={`

                                            form-select mb-1

                                            ${erros.loja
                                                ? 'is-invalid'
                                                : ''
                                            }

                                        `}

                                        value={
                                            novoFuncionario.loja_padrao_id
                                        }

                                        onChange={e => {

                                            const lojaSelecionada =
                                                lojas.find(

                                                    loja =>
                                                        loja.id ===
                                                        e.target.value

                                                )

                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                loja_padrao_id:
                                                    e.target.value,

                                                loja:
                                                    lojaSelecionada?.nome || ''

                                            })

                                        }}

                                    >

                                        <option value="">
                                            Selecione a loja
                                        </option>

                                        {

                                            lojas.map(

                                                loja => (

                                                    <option

                                                        key={loja.id}

                                                        value={loja.id}

                                                    >

                                                        {loja.nome}

                                                    </option>

                                                )

                                            )

                                        }

                                    </select>

                                    {

                                        erros.loja && (

                                            <div
                                                className="invalid-feedback d-block mb-2"
                                            >

                                                Loja obrigatória

                                            </div>

                                        )

                                    }

                                    <input

                                        className="form-control mb-3"

                                        placeholder="Cargo"

                                        value={
                                            novoFuncionario.cargo
                                        }

                                        onInput={e =>
                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                cargo:
                                                    e.target.value

                                            })
                                        }

                                    />

                                    <input

                                        type="number"

                                        className="form-control"

                                        placeholder="Valor Hora"

                                        value={
                                            novoFuncionario.valor_hora
                                        }

                                        onInput={e =>
                                            setNovoFuncionario({

                                                ...novoFuncionario,

                                                valor_hora:
                                                    Number(
                                                        e.target.value
                                                    )

                                            })
                                        }

                                    />

                                </div>

                                <div
                                    className="modal-footer"
                                >
                                    {

                                        funcionarioEditando &&

                                        funcionarioEditando.status === 'Ativo' && (

                                            <button

                                                className="btn btn-outline-danger me-auto"

                                                onClick={
                                                    desativarFuncionarioAtual
                                                }

                                            >

                                                Desativar Funcionário

                                            </button>

                                        )

                                    }

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setModalAberto(false)
                                        }
                                    >

                                        Cancelar

                                    </button>

                                    <button
                                        className="btn btn-app"
                                        onClick={
                                            salvarFuncionario
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