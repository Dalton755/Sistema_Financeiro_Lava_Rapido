import {
  useNavigate
}
  from 'react-router-dom'

import {
  useEffect,
  useState
}
  from 'preact/hooks'

import Layout
  from '../components/Layout'

import {
  listarFuncionarios
}
  from '../services/funcionarios'

import {

  listarAdiantamentos,

  criarAdiantamento,

  totalAdiantamentosFuncionario

}
  from '../services/adiantamentos'

export default function Adiantamentos() {

  const navigate =
    useNavigate()

  const [
    funcionarios,
    setFuncionarios
  ] = useState([])

  const [
    busca,
    setBusca
  ] = useState('')

  const [
    mostrarResultados,
    setMostrarResultados
  ] = useState(false)

  const [
    funcionarioSelecionado,
    setFuncionarioSelecionado
  ] = useState(null)

  const [
    totalAberto,
    setTotalAberto
  ] = useState(0)

  const [
    adiantamento,
    setAdiantamento
  ] = useState({

    funcionario_id: '',

    data:
      new Date()
        .toISOString()
        .split('T')[0],

    valor: '',

    observacao: ''

  })

  const [
    ultimosAdiantamentos,
    setUltimosAdiantamentos
  ] = useState([])

  useEffect(() => {

    carregar()

  }, [])

  async function carregar() {

    try {

      const [

        dadosFuncionarios,

        dadosAdiantamentos

      ] = await Promise.all([

        listarFuncionarios(),

        listarAdiantamentos()

      ])

      setFuncionarios(
        dadosFuncionarios
      )

      setUltimosAdiantamentos(
        dadosAdiantamentos
      )

    }

    catch (erro) {

      console.error(
        erro
      )

    }

  }

  async function salvarAdiantamento() {

    try {

      if (
        !adiantamento.funcionario_id
      ) {

        alert(
          'Selecione um funcionário.'
        )

        return

      }

      if (

        !adiantamento.valor ||

        Number(
          adiantamento.valor
        ) <= 0

      ) {

        alert(
          'Informe um valor válido.'
        )

        return

      }

      await criarAdiantamento({

        funcionario_id:
          adiantamento.funcionario_id,

        data:
          adiantamento.data,

        valor:
          Number(
            adiantamento.valor
          ),

        observacao:
          adiantamento.observacao,

        status:
          'Aberto'

      })

      alert(
        'Adiantamento salvo com sucesso.'
      )

      setAdiantamento({

        funcionario_id: '',

        data:
          adiantamento.data,

        valor: '',

        observacao: ''

      })

      setFuncionarioSelecionado(
        null
      )

      setBusca('')

      setTotalAberto(0)

      await carregar()

    }

    catch (erro) {

      console.error(
        erro
      )

      alert(
        'Erro ao salvar adiantamento.'
      )

    }

  }

  const funcionariosFiltrados =

    funcionarios.filter(

      funcionario =>

        funcionario.nome

          .toLowerCase()

          .includes(

            busca.toLowerCase()

          )

    )

  function formatarNome(nome) {

    const partes = nome.split(' ')

    if (partes.length === 1)
      return partes[0]

    return `${partes[0]} ${partes[1]}`

  }

  function formatarData(data) {

    const dt = new Date(data)

    return dt.toLocaleDateString('pt-BR')

  }

  function corStatus(status) {

    switch (status) {

      case 'Aberto':
        return 'success'

      case 'Compensado':
        return 'primary'

      case 'Cancelado':
        return 'danger'

      default:
        return 'secondary'

    }

  }

  return (

    <Layout>

      <h1
        className="page-title"
      >

        Adiantamentos

      </h1>

      <div
        className="card-app mt-3"
      >

        <h3>

          Novo Adiantamento

        </h3>

        <div className="mb-3">

          <label>

            Data

          </label>

          <input

            type="date"

            className="form-control"

            value={
              adiantamento.data
            }

            onChange={e =>

              setAdiantamento({

                ...adiantamento,

                data:
                  e.target.value

              })

            }

          />

        </div>

        <div className="mb-3">

          <label>

            Funcionário

          </label>

          <input

            type="text"

            className="form-control"

            placeholder="Digite o nome"

            value={busca}

            onFocus={() =>

              setMostrarResultados(
                true
              )

            }

            onChange={e => {

              setBusca(
                e.target.value
              )

              setMostrarResultados(
                true
              )

            }}

          />

        </div>

        {

          mostrarResultados &&

          busca &&

          funcionariosFiltrados

            .slice(0, 8)

            .map(

              funcionario => (

                <div

                  key={
                    funcionario.id
                  }

                  className="p-2 border-bottom"

                  style={{
                    cursor: 'pointer'
                  }}

                  onClick={async () => {

                    setFuncionarioSelecionado(
                      funcionario
                    )

                    setAdiantamento({

                      ...adiantamento,

                      funcionario_id:
                        funcionario.id

                    })

                    const total =

                      await totalAdiantamentosFuncionario(

                        funcionario.id

                      )

                    setTotalAberto(
                      total
                    )

                    setBusca('')

                    setMostrarResultados(
                      false
                    )

                  }}

                >

                  {
                    funcionario.nome
                  }

                </div>

              )

            )

        }

        {

          funcionarioSelecionado && (

            <div
              className="alert alert-info mt-3"
            >

              <div className="mb-3">

                <label>

                  Valor

                </label>

                <input

                  type="number"

                  step="0.01"

                  className="form-control"

                  placeholder="0,00"

                  value={
                    adiantamento.valor
                  }

                  onChange={e =>

                    setAdiantamento({

                      ...adiantamento,

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
                    adiantamento.observacao
                  }

                  onChange={e =>

                    setAdiantamento({

                      ...adiantamento,

                      observacao:
                        e.target.value

                    })

                  }

                />

              </div>



              <strong>

                Funcionário:

              </strong>

              {' '}

              {
                funcionarioSelecionado.nome
              }

              <br />

              <strong>

                Adiantamentos em aberto:

              </strong>

              {' '}

              R$

              {
                totalAberto.toFixed(2)
              }

            </div>


          )



        }

      </div>

      <button

        className="btn btn-primary"

        onClick={
          salvarAdiantamento
        }

      >

        Salvar Adiantamento

      </button>

      <div
        className="card-app mt-4"
      >

        <h3>

          Últimos Adiantamentos

        </h3>

        {

          ultimosAdiantamentos.length === 0

            ? (

              <p>

                Nenhum adiantamento encontrado.

              </p>

            )

            : (

              ultimosAdiantamentos

                .slice(0, 10)

                .map(

                  item => (

                    <div

                      key={
                        item.id
                      }

                      className="border-bottom p-2"

                      style={{
                        cursor: 'pointer'
                      }}

                      onClick={() =>

                        navigate(

                          `/adiantamentos/${item.id}`

                        )

                      }

                    >

                      <div
                        className="d-flex justify-content-between align-items-center"
                      >

                        <div>

                          <strong>

                            {
                              formatarNome(
                                item.funcionarios?.nome || ''
                              )
                            }

                          </strong>

                          <div
                            className="text-muted small"
                          >

                            {
                              formatarData(
                                item.data
                              )
                            }

                          </div>

                        </div>

                        <div
                          className="text-end"
                        >

                          <div>

                            <strong>

                              R$

                              {
                                Number(
                                  item.valor
                                ).toFixed(2)
                              }

                            </strong>

                          </div>

                          <span

                            className={

                              `badge bg-${corStatus(
                                item.status
                              )

                              }`

                            }

                          >

                            {
                              item.status
                            }

                          </span>

                        </div>

                      </div>

                    </div>

                  )

                )

            )

        }

      </div>

    </Layout>

  )

}