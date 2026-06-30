import {
  useNavigate
}
  from 'react-router-dom'

import Layout
  from '../components/Layout'

import {
  useEffect,
  useState
}
  from 'preact/hooks'

import {
  Search,
  Clock3,
  Save
}
  from 'lucide-react'

import {
  listarFuncionarios
}
  from '../services/funcionarios'

import {
  listarLojas
}
  from '../services/lojas'

import {

  listarPontosPorData,

  criarPonto,

  atualizarPonto,

  obterUltimaDataPonto,

  listarPontosFuncionarioData

}
  from '../services/pontos'

export default function Ponto() {

  const [
    funcionarios,
    setFuncionarios
  ] = useState([])

  const [
    funcionarioSelecionado,
    setFuncionarioSelecionado
  ] = useState(null)

  const [
    mostrarResultados,
    setMostrarResultados
  ] = useState(false)

  const [
    lojas,
    setLojas
  ] = useState([])

  const [
    busca,
    setBusca
  ] = useState('')

  const [
    modalEscalaAberto,
    setModalEscalaAberto
  ] = useState(false)

  const [
    pontosDia,
    setPontosDia
  ] = useState([])

  const [
    lojaExpandida,
    setLojaExpandida
  ] = useState(null)

  const [
    pontoEditando,
    setPontoEditando
  ] = useState(null)



  const [
    ponto,
    setPonto
  ] = useState({

    funcionario_id: '',

    loja_id: '',

    data:
      new Date()
        .toISOString()
        .split('T')[0],

    escala: '',

    entrada: '',

    saida_almoco: '',

    retorno_almoco: '',

    saida: ''

  })

  const navigate =
    useNavigate()




  useEffect(() => {

    async function iniciar() {

      const ultimaData =

        await obterUltimaDataPonto()

      const dataInicial =

        ultimaData ||

        new Date()
          .toISOString()
          .split('T')[0]

      setPonto(prev => ({

        ...prev,

        data:
          dataInicial

      }))

      await carregar(
        dataInicial
      )

    }

    iniciar()

  }, [])

  function calcularHoras() {

    if (
      !ponto.entrada ||
      !ponto.saida_almoco ||
      !ponto.retorno_almoco ||
      !ponto.saida
    ) {

      return 0

    }

    const entrada =
      new Date(
        `2000-01-01 ${ponto.entrada}`
      )

    const saidaAlmoco =
      new Date(
        `2000-01-01 ${ponto.saida_almoco}`
      )

    const retorno =
      new Date(
        `2000-01-01 ${ponto.retorno_almoco}`
      )

    const saida =
      new Date(
        `2000-01-01 ${ponto.saida}`
      )

    const periodo1 =
      (saidaAlmoco - entrada)

    const periodo2 =
      (saida - retorno)

    return (
      (periodo1 + periodo2)
      /
      1000
      /
      60
      /
      60
    ).toFixed(2)

  }

  function calcularHorasEdicao() {

    if (!pontoEditando)
      return 0

    const entrada =
      new Date(
        `2000-01-01 ${pontoEditando.entrada}`
      )

    const saidaAlmoco =
      new Date(
        `2000-01-01 ${pontoEditando.saida_almoco}`
      )

    const retorno =
      new Date(
        `2000-01-01 ${pontoEditando.retorno_almoco}`
      )

    const saida =
      new Date(
        `2000-01-01 ${pontoEditando.saida}`
      )

    return (

      (
        (saidaAlmoco - entrada)
        +
        (saida - retorno)
      )

      /

      1000

      /

      60

      /

      60

    ).toFixed(2)

  }

  async function salvarEdicao() {

    try {

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
            calcularHorasEdicao()

        }

      )

      await carregar()

      setPontoEditando(
        null
      )

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

  function abreviarNome(
    nome
  ) {

    if (!nome)
      return ''

    const partes =
      nome.trim().split(' ')

    if (
      partes.length === 1
    )
      return nome

    return `${partes[0]

      } ${partes[1][0]

      }.`

  }

  function obterPontosLoja(
    lojaNome
  ) {

    return pontosDia.filter(

      ponto =>

        ponto.loja ===
        lojaNome

    )

  }

  async function salvarPonto() {

    try {

      if (
        !ponto.funcionario_id ||
        !ponto.loja_id ||
        !ponto.escala
      ) {

        alert(
          'Preencha os campos obrigatórios.'
        )

        return

      }

      const lojaSelecionada =
        lojas.find(

          loja =>
            loja.id ===
            ponto.loja_id

        )

      const pontosExistentes =

        await listarPontosFuncionarioData(

          ponto.funcionario_id,

          ponto.data

        )

      const conflito =

        existeConflitoHorario(

          ponto.entrada,

          ponto.saida,

          pontosExistentes

        )

      if (conflito) {

        alert(

          'Conflito de jornada.\n\n' +

          'Este funcionário já possui um ponto registrado nesse período.'

        )

        return

      }

      await criarPonto({

        funcionario_id:
          ponto.funcionario_id,

        data:
          ponto.data,

        loja:
          lojaSelecionada?.nome,

        loja_id:
          ponto.loja_id,

        escala:
          ponto.escala,

        entrada:
          ponto.entrada,

        saida_almoco:
          ponto.saida_almoco,

        retorno_almoco:
          ponto.retorno_almoco,

        saida:
          ponto.saida,

        horas:
          calcularHoras(),

        status:
          'Aberto'

      })


      alert(
        'Ponto salvo com sucesso.'
      )

      setModalEscalaAberto(false)

      await carregar(
        ponto.data
      )

      setFuncionarioSelecionado(
        null
      )

      setBusca('')

      setPonto({

        funcionario_id: '',

        loja_id: '',

        data:
          ponto.data,

        escala: '',

        entrada: '',

        saida_almoco: '',

        retorno_almoco: '',

        saida: ''

      })

      const dataAtualTela =
        ponto.data

    }

    catch (erro) {

      console.error(
        erro
      )

      alert(
        'Erro ao salvar ponto.'
      )

    }

  }

  async function carregar(
    dataSelecionada
  ) {

    const [

      dadosFuncionarios,

      dadosLojas,

      dadosPontos

    ] = await Promise.all([

      listarFuncionarios(),

      listarLojas(),

      listarPontosPorData(
        dataSelecionada
      )

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
      'DATA',
      dataSelecionada
    )

    console.log(
      'PONTOS',
      dadosPontos
    )

    setPontosDia(
      dadosPontos
    )

  }

  function aplicarEscala(
    escala
  ) {


    const horarios = {

      '07-16': {

        entrada: '07:00',
        saida_almoco: '12:00',
        retorno_almoco: '13:00',
        saida: '16:00'

      },

      '08-17': {

        entrada: '08:00',
        saida_almoco: '12:00',
        retorno_almoco: '13:00',
        saida: '17:00'

      },

      '12-20': {

        entrada: '12:00',
        saida_almoco: '17:00',
        retorno_almoco: '18:00',
        saida: '20:00'

      },

      '14-21': {

        entrada: '14:00',
        saida_almoco: '17:00',
        retorno_almoco: '18:00',
        saida: '21:00'

      }

    }

    setPonto({

      ...ponto,

      escala,

      ...horarios[
      escala
      ]

    })



  }
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

    pontosExistentes

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

  const funcionariosFiltrados =

    funcionarios.filter(

      funcionario =>

        funcionario.nome

          .toLowerCase()

          .includes(

            busca.toLowerCase()

          )

    )

  return (

    <Layout>

      <div className="mb-4">

        <h1 className="page-title">
          Ponto
        </h1>

        <p className="page-subtitle">
          Registro de jornada
        </p>

      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <label className="form-label">
            Data
          </label>

          <input

            type="date"

            className="form-control"

            value={ponto.data}

            onChange={async e => {

              const novaData =
                e.target.value

              setPonto({

                ...ponto,

                data:
                  novaData

              })

              await carregar(
                novaData
              )

            }}

          />

        </div>

        <button
          className="btn btn-app"
          onClick={() =>
            setModalEscalaAberto(true)
          }
        >
          + Bater Ponto
        </button>

      </div>






      {
        modalEscalaAberto && (

          <div
            className="modal fade show d-block"
            style={{
              background:
                'rgba(0,0,0,.5)'
            }}
          >

            <div
              className="modal-dialog modal-dialog-centered"
            >

              <div
                className="modal-content"
              >

                <div
                  className="modal-header"
                >

                  <h5>
                    Horários da Escala
                  </h5>

                </div>

                <div
                  className="modal-body"
                >

                  <div className="card-app">

                    <div className="mb-3">

                      <label>
                        Funcionário
                      </label>

                      <input
                        className="form-control"
                        placeholder="Digite o nome do funcionário"
                        value={busca}

                        onInput={e => {

                          setBusca(
                            e.target.value
                          )

                          setMostrarResultados(
                            true
                          )

                        }}
                      />

                      {
                        mostrarResultados &&
                        busca &&
                        funcionariosFiltrados
                          .slice(0, 8)
                          .map(funcionario => (

                            <div

                              key={funcionario.id}

                              className="p-2 border-bottom"

                              style={{
                                cursor: 'pointer'
                              }}

                              onClick={() => {

                                setFuncionarioSelecionado(
                                  funcionario
                                )

                                setPonto({

                                  ...ponto,

                                  funcionario_id:
                                    funcionario.id,

                                  loja_id:
                                    funcionario.loja_padrao_id || ''

                                })

                                setBusca('')

                                setMostrarResultados(
                                  false
                                )

                              }}

                            >

                              {funcionario.nome}

                            </div>

                          ))
                      }

                      {
                        funcionarioSelecionado && (

                          <>

                            <div
                              className="alert alert-success mt-2"
                            >

                              Funcionário:

                              <strong>

                                {' '}

                                {funcionarioSelecionado.nome}

                              </strong>

                            </div>

                            <div
                              className="alert alert-info mt-2"
                            >

                              Loja padrão:

                              <strong>

                                {' '}

                                {
                                  funcionarioSelecionado.lojas?.nome
                                  ||
                                  funcionarioSelecionado.loja
                                }

                              </strong>

                            </div>

                          </>

                        )
                      }

                    </div>

                    <div className="mb-3">



                    </div>

                    <div className="mb-3">

                      <label>
                        Loja
                      </label>

                      <select

                        className="form-select"

                        value={
                          ponto.loja_id
                        }

                        onChange={e =>

                          setPonto({

                            ...ponto,

                            loja_id:
                              e.target.value

                          })

                        }

                      >

                        <option value="">
                          Selecione
                        </option>

                        {

                          lojas.map(

                            loja => (

                              <option

                                key={
                                  loja.id
                                }

                                value={
                                  loja.id
                                }

                              >

                                {
                                  loja.nome
                                }

                              </option>

                            )

                          )

                        }

                      </select>

                    </div>

                    <div className="mb-3">

                      <label>
                        Data
                      </label>

                      <input

                        type="date"

                        className="form-control"

                        value={
                          ponto.data
                        }

                      />

                    </div>

                    <div className="mb-3">

                      <label>
                        Escala
                      </label>

                      <select

                        className="form-select"

                        value={
                          ponto.escala
                        }

                        onChange={e =>

                          aplicarEscala(
                            e.target.value
                          )

                        }

                      >

                        <option value="">
                          Selecione
                        </option>

                        <option value="07-16">
                          07:00 às 16:00
                        </option>

                        <option value="08-17">
                          08:00 às 17:00
                        </option>

                        <option value="12-20">
                          12:00 às 20:00
                        </option>

                        <option value="14-21">
                          14:00 às 21:00
                        </option>

                      </select>

                      {
                        ponto.escala && (

                          <div className="mt-3">

                            <div className="row">

                              <div className="col-6 mb-2">

                                <label>
                                  Entrada
                                </label>

                                <input

                                  type="time"

                                  className="form-control"

                                  value={
                                    ponto.entrada
                                  }

                                  onChange={e =>

                                    setPonto({

                                      ...ponto,

                                      entrada:
                                        e.target.value

                                    })

                                  }

                                />

                              </div>

                              <div className="col-6 mb-2">

                                <label>
                                  Saída almoço
                                </label>

                                <input

                                  type="time"

                                  className="form-control"

                                  value={
                                    ponto.saida_almoco
                                  }

                                  onChange={e =>

                                    setPonto({

                                      ...ponto,

                                      saida_almoco:
                                        e.target.value

                                    })

                                  }

                                />

                              </div>

                              <div className="col-6">

                                <label>
                                  Retorno
                                </label>

                                <input

                                  type="time"

                                  className="form-control"

                                  value={
                                    ponto.retorno_almoco
                                  }

                                  onChange={e =>

                                    setPonto({

                                      ...ponto,

                                      retorno_almoco:
                                        e.target.value

                                    })

                                  }

                                />

                              </div>

                              <div className="col-6">

                                <label>
                                  Saída
                                </label>

                                <input

                                  type="time"

                                  className="form-control"

                                  value={
                                    ponto.saida
                                  }

                                  onChange={e =>

                                    setPonto({

                                      ...ponto,

                                      saida:
                                        e.target.value

                                    })

                                  }

                                />

                              </div>

                            </div>

                          </div>

                        )
                      }

                    </div>

                    {
                      funcionarioSelecionado &&
                      ponto.escala && (

                        <div
                          className="card-app mt-4"
                        >

                          <h5>
                            Resumo do Ponto
                          </h5>

                          <hr />

                          <div>

                            Funcionário:
                            <strong>
                              {' '}
                              {funcionarioSelecionado.nome}
                            </strong>

                          </div>

                          <div>

                            Loja:
                            <strong>
                              {' '}

                              {
                                lojas.find(
                                  l =>
                                    l.id ===
                                    ponto.loja_id
                                )?.nome
                              }

                            </strong>

                          </div>

                          <div>

                            Escala:
                            <strong>
                              {' '}
                              {ponto.escala}
                            </strong>

                          </div>

                          <hr />

                          <div>
                            Entrada:
                            {' '}
                            {ponto.entrada}
                          </div>

                          <div>
                            Saída almoço:
                            {' '}
                            {ponto.saida_almoco}
                          </div>

                          <div>
                            Retorno:
                            {' '}
                            {ponto.retorno_almoco}
                          </div>

                          <div>
                            Saída:
                            {' '}
                            {ponto.saida}
                          </div>

                          <hr />

                          <h5>

                            Total:
                            {' '}

                            {calcularHoras()} h

                          </h5>

                          <button

                            className="btn btn-app w-100 mt-3"

                            onClick={
                              salvarPonto
                            }

                          >

                            Salvar Ponto

                          </button>

                        </div>

                      )
                    }

                  </div>

                </div>

                <div
                  className="modal-footer"
                >

                  <div
                    className="alert alert-info"
                  >

                    Horas previstas:

                    <strong>

                      {' '}

                      {calcularHoras()} h

                    </strong>

                  </div>

                  <button

                    className="btn btn-secondary"

                    onClick={() =>

                      setModalEscalaAberto(
                        false
                      )

                    }

                  >

                    Cancelar

                  </button>

                  

                </div>

              </div>

            </div>

          </div>

        )
      }


      <div className="row mt-4">

        {

          lojas.map(

            loja => {

              const pontosLoja =

                obterPontosLoja(
                  loja.nome
                )

              if (
                pontosLoja.length === 0
              )
                return null

              const exibir =

                lojaExpandida ===
                  loja.id

                  ? pontosLoja

                  : pontosLoja.slice(
                    0,
                    3
                  )

              return (

                <div
                  className="col-md-4 mb-4"
                  key={loja.id}
                >

                  <div
                    className="card-app"
                  >

                    <h5>

                      {loja.nome}

                      <span
                        className="badge bg-primary ms-2"
                      >

                        {pontosLoja.length}

                      </span>

                    </h5>

                    <hr />

                    {

                      exibir.map(

                        ponto => (

                          <div

                            key={ponto.id}

                            className="card-app mb-2"

                            style={{
                              cursor: 'pointer',
                              padding: '10px'
                            }}

                            onClick={() =>

                              navigate(

                                `/ponto/${ponto.id}`

                              )

                            }

                          >

                            <div>

                              <div>

                                <strong>

                                  {
                                    abreviarNome(
                                      ponto.funcionarios?.nome
                                    )
                                  }

                                </strong>

                              </div>

                              <small
                                className="text-muted"
                              >

                                {

                                  ponto.entrada?.substring(
                                    0,
                                    5
                                  )

                                }

                                {' → '}

                                {

                                  ponto.saida?.substring(
                                    0,
                                    5
                                  )

                                }

                              </small>

                              <br />

                              <small
                                className="text-muted"
                              >

                                {

                                  Number(
                                    ponto.horas || 0
                                  ).toFixed(2)

                                }

                                h

                              </small>

                            </div>

                          </div>

                        )

                      )

                    }

                    {

                      pontosLoja.length > 3 && (

                        <div
                          className="mt-2 text-center"
                        >

                          <small

                            style={{
                              cursor:
                                'pointer'
                            }}

                            onClick={() =>

                              setLojaExpandida(

                                lojaExpandida === loja.id

                                  ? null

                                  : loja.id

                              )

                            }

                          >

                            {

                              lojaExpandida === loja.id

                                ? 'Ver menos'

                                : 'Ver mais'

                            }

                          </small>

                        </div>

                      )

                    }

                  </div>

                </div>

              )

            }

          )

        }

      </div>

      {
        pontoEditando && (

          <div
            className="modal fade show d-block"
            style={{
              background:
                'rgba(0,0,0,.5)'
            }}
          >

            <div
              className="modal-dialog modal-dialog-centered"
            >

              <div
                className="modal-content"
              >

                <div
                  className="modal-header"
                >

                  <h5>
                    Editar Ponto
                  </h5>

                </div>

                <div
                  className="modal-body"
                >

                  <div
                    className="alert alert-info"
                  >

                    {

                      pontoEditando
                        .funcionarios
                        ?.nome

                    }

                  </div>

                  <div
                    className="mb-3"
                  >

                    <label>
                      Entrada
                    </label>

                    <input

                      type="time"

                      className="form-control"

                      value={
                        pontoEditando
                          .entrada
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

                  <div
                    className="mb-3"
                  >

                    <label>
                      Saída Almoço
                    </label>

                    <input

                      type="time"

                      className="form-control"

                      value={
                        pontoEditando
                          .saida_almoco
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

                  <div
                    className="mb-3"
                  >

                    <label>
                      Retorno Almoço
                    </label>

                    <input

                      type="time"

                      className="form-control"

                      value={
                        pontoEditando
                          .retorno_almoco
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

                  <div
                    className="mb-3"
                  >

                    <label>
                      Saída
                    </label>

                    <input

                      type="time"

                      className="form-control"

                      value={
                        pontoEditando
                          .saida
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

                  <div
                    className="alert alert-success"
                  >

                    Horas:

                    <strong>

                      {' '}

                      {
                        calcularHorasEdicao()
                      }

                      h

                    </strong>

                  </div>

                </div>

                <div
                  className="modal-footer"
                >

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

                    className="btn btn-app"

                    onClick={
                      salvarEdicao
                    }

                  >

                    Salvar Alterações

                  </button>

                </div>

              </div>

            </div>

          </div>

        )
      }

    </Layout >

  )

}