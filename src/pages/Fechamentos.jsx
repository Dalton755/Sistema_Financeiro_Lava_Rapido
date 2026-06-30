import {

  useState,

  useEffect

}
  from 'preact/hooks'

import Layout
  from '../components/Layout'

import {

  listarLojas

}
  from '../services/lojas'

import {

  listarFuncionarios

}
  from '../services/funcionarios'

import {

  gerarPreviaFechamento

}
  from '../services/fechamentos'

import CardFuncionario
  from '../components/fechamento/CardFuncionario'

import ModalDetalhes from '../components/fechamento/ModalDetalhes'

import {

  confirmarFechamento

} from '../services/fechamentos'





export default function Fechamentos() {

  const [

    tipo,

    setTipo

  ] = useState('LOJA')

  const [

    competencia,

    setCompetencia

  ] = useState(

    new Date()

      .toISOString()

      .slice(0, 7)

  )

  const [

    quinzena,

    setQuinzena

  ] = useState(1)

  const [

    lojas,

    setLojas

  ] = useState([])

  const [

    funcionarios,

    setFuncionarios

  ] = useState([])

  const [

    lojaId,

    setLojaId

  ] = useState('')

  const [

    funcionarioId,

    setFuncionarioId

  ] = useState('')


  const [

    previa,

    setPrevia

  ] = useState(null)

  const [

    funcionarioDetalhes,

    setFuncionarioDetalhes

  ] = useState(null)

  const [

    carregando,

    setCarregando

  ] = useState(false)












  useEffect(() => {

    carregar()

  }, [])

  async function carregar() {

    try {

      const [

        dadosLojas,

        dadosFuncionarios

      ] = await Promise.all([

        listarLojas(),

        listarFuncionarios()

      ])

      setLojas(

        dadosLojas.filter(

          loja =>

            loja.status === 'Ativa'

        )

      )

      setFuncionarios(

        dadosFuncionarios.filter(

          funcionario =>

            funcionario.status === 'Ativo'

        )

      )

    }

    catch (erro) {

      console.error(

        erro

      )

    }

  }


  async function gerarPrevia() {

    try {

      setCarregando(true)

      const resultado =

        await gerarPreviaFechamento({

          tipo,

          lojaId,

          funcionarioId,

          competencia:
            competencia + '-01',

          quinzena

        })

      console.log('RESULTADO')

      console.log(resultado)

      setPrevia(resultado)

      console.log('ESTADO ATUAL')

      console.log(resultado.funcionarios.length)

    }

    catch (erro) {

      console.error(erro)

      alert('Erro ao gerar prévia.')

    }

    finally {

      setCarregando(false)

    }

  }

  async function confirmar() {

    const confirmarFechamentoUsuario =

      window.confirm(

        'Deseja realmente confirmar este fechamento?\n\nApós confirmar os pontos e adiantamentos serão bloqueados.'

      )

    if (

      !confirmarFechamentoUsuario

    )

      return

    try {

      setCarregando(

        true

      )

      await confirmarFechamento(

        previa

      )

      alert(

        'Fechamento realizado com sucesso.'

      )

      window.location.reload()

    }

    catch (

    erro

    ) {

      alert(

        erro.message

      )

    }

    finally {

      setCarregando(

        false

      )

    }

  }



  return (

    <Layout>

      <h1 className="page-title">

        Fechamentos

      </h1>

      <div className="card-app mt-3">

        <h3>

          Gerar Fechamento

        </h3>

        <div className="mb-3">

          <label>

            Tipo

          </label>

          <select

            className="form-control"

            value={tipo}

            onChange={e =>

              setTipo(

                e.target.value

              )

            }

          >

            <option value="LOJA">

              Loja

            </option>

            <option value="FUNCIONARIO">

              Funcionário

            </option>

          </select>

        </div>

        <div className="mb-3">

          <label>

            Competência

          </label>

          <input

            type="month"

            className="form-control"

            value={competencia}

            onChange={e =>

              setCompetencia(

                e.target.value

              )

            }

          />

        </div>

        <div className="mb-3">

          <label>

            Quinzena

          </label>

          <select

            className="form-control"

            value={quinzena}

            onChange={e =>

              setQuinzena(

                Number(

                  e.target.value

                )

              )

            }

          >

            <option value={1}>

              1ª Quinzena

            </option>

            <option value={2}>

              2ª Quinzena

            </option>

          </select>

        </div>

        {

          tipo === 'LOJA' && (

            <div className="mb-3">

              <label>

                Loja

              </label>

              <select

                className="form-control"

                value={lojaId}

                onChange={e =>

                  setLojaId(

                    e.target.value

                  )

                }

              >

                <option value="">

                  Selecione...

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

            </div>

          )

        }

        {

          tipo === 'FUNCIONARIO' && (

            <div className="mb-3">

              <label>

                Funcionário

              </label>

              <select

                className="form-control"

                value={funcionarioId}

                onChange={e =>

                  setFuncionarioId(

                    e.target.value

                  )

                }

              >

                <option value="">

                  Selecione...

                </option>

                {

                  funcionarios.map(

                    funcionario => (

                      <option

                        key={funcionario.id}

                        value={funcionario.id}

                      >

                        {funcionario.nome}

                      </option>

                    )

                  )

                }

              </select>

            </div>

          )

        }

        <button

          className="btn btn-primary w-100"

          disabled={carregando}

          onClick={gerarPrevia}

        >

          {

            carregando

              ? 'Gerando...'

              : 'Gerar Prévia'

          }

        </button>

        {

          previa && (

            <button

              className="btn btn-success w-100 mt-2"

              disabled={carregando}

              onClick={confirmar}

            >

              {

                carregando

                  ? 'Confirmando...'

                  : 'Confirmar Fechamento'

              }

            </button>

          )

        }

        {

          previa && (

            <div className="card-app mt-3">

              <div className="row text-center">

                <div className="col">

                  <small>

                    Funcionários

                  </small>

                  <h5>

                    {

                      previa.funcionarios.length

                    }

                  </h5>

                </div>

                <div className="col">

                  <small>

                    Horas

                  </small>

                  <h5>

                    {

                      previa.totalHoras.toFixed(2)

                    }

                  </h5>

                </div>

              </div>

              <hr />

              <div className="row text-center">

                <div className="col">

                  <small>

                    Bruto

                  </small>

                  <h5>

                    R$

                    {

                      previa.totalBruto.toFixed(2)

                    }

                  </h5>

                </div>

                <div className="col">

                  <small>

                    Adiantamentos

                  </small>

                  <h5 className="text-danger">

                    R$

                    {

                      previa.totalAdiantamentos.toFixed(2)

                    }

                  </h5>

                </div>

                <div className="col">

                  <small>

                    Líquido

                  </small>

                  <h5 className="text-success">

                    R$

                    {

                      previa.totalLiquido.toFixed(2)

                    }

                  </h5>

                </div>

              </div>

            </div>

          )

        }

        {

          previa && (

            <>

              <h4 className="mt-4 mb-3">

                Funcionários

              </h4>

              {

                previa.funcionarios.map(

                  funcionario => (

                    <CardFuncionario

                      key={

                        funcionario.funcionario_id

                      }

                      funcionario={

                        funcionario

                      }

                      onDetalhes={

                        setFuncionarioDetalhes

                      }

                    />

                  )

                )

              }

            </>

          )

        }

      </div>

      <ModalDetalhes

        funcionario={

          funcionarioDetalhes

        }

        onFechar={() =>

          setFuncionarioDetalhes(

            null

          )

        }

      />

    </Layout>



  )

}