import Layout
  from '../components/Layout'

import { listarPagamentosPendentes } from '../services/pagamentos'

import { useEffect, useState } from 'react'

import {

  efetuarPagamento

}

  from '../services/pagamentos'



export default function Pagamentos() {

  const [pagamentos, setPagamentos] = useState([])
  const [carregando, setCarregando] = useState(true)

  const [

    pagamentoSelecionado,

    setPagamentoSelecionado

  ] = useState(null)

  const [

    formaPagamento,

    setFormaPagamento

  ] = useState('PIX')

  const [

    dataPagamento,

    setDataPagamento

  ] = useState(

    new Date()

      .toISOString()

      .split('T')[0]

  )

  const [

    observacao,

    setObservacao

  ] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    try {
      const dados = await listarPagamentosPendentes()

      console.log('PAGAMENTOS', dados)

      setPagamentos(dados)
    } catch (erro) {
      console.error(erro)
      alert('Erro ao carregar pagamentos.')
    } finally {
      setCarregando(false)
    }
  }


  return (

    <Layout>

      <h1
        className="page-title"
      >
        Pagamentos
      </h1>

      <p>Total de fechamentos: {pagamentos.length}</p>

      {carregando && <p>Carregando...</p>}

      {pagamentos.map(fechamento => (

        <div
          key={fechamento.id}
          className="card"
          style={{ marginBottom: 20 }}
        >

          <h3>
            {fechamento.loja_nome || 'Loja'}
          </h3>

          <p>
            Competência:
            {' '}
            {fechamento.competencia}
          </p>

          <p>
            Quinzena:
            {' '}
            {fechamento.quinzena}
          </p>

          <hr />

          {fechamento.itens.map(item => (

            <div
              key={item.id}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}
            >

              <strong>

                {item.funcionarios?.nome}

              </strong>

              <br />

              <p>

                Bruto:

                {' '}

                R$

                {' '}

                {Number(item.valor_bruto).toFixed(2)}

              </p>

              <p>

                Adiantamentos:

                {' '}

                R$

                {' '}

                {Number(item.valor_adiantamentos).toFixed(2)}

              </p>

              <p>

                <strong>

                  Líquido:

                  {' '}

                  R$

                  {' '}

                  {Number(item.valor_liquido).toFixed(2)}

                </strong>

              </p>

              <p
                style={{
                  color: '#d97706',
                  fontWeight: 'bold'
                }}
              >

                ⏳ Aguardando pagamento

              </p>
              <button

                className="btn btn-success"

                onClick={() => {

                  setPagamentoSelecionado({

                    fechamento,

                    funcionario: item

                  })

                  setFormaPagamento('PIX')

                  setObservacao('')

                  setDataPagamento(

                    new Date()

                      .toISOString()

                      .split('T')[0]

                  )

                }}

              >

                Efetuar Pagamento

              </button>

            </div>

          ))}

        </div>

      ))}

      {

        pagamentoSelecionado && (

          <div

            className="modal fade show"

            style={{

              display: 'block',

              background:

                'rgba(0,0,0,.5)'

            }}

          >

            <div className="modal-dialog">

              <div className="modal-content">

                <div className="modal-header">

                  <h5>

                    Efetuar Pagamento

                  </h5>

                  <button

                    className="btn-close"

                    onClick={() =>

                      setPagamentoSelecionado(null)

                    }

                  />

                </div>

                <div className="modal-body">

                  <p>

                    <strong>

                      Funcionário

                    </strong>

                    <br />

                    {

                      pagamentoSelecionado.funcionario.funcionarios?.nome

                    }

                  </p>

                  <p>

                    <strong>

                      Valor

                    </strong>

                    <br />

                    R$

                    {

                      Number(

                        pagamentoSelecionado.funcionario.valor_liquido

                      ).toFixed(2)

                    }

                  </p>

                  <div className="mb-3">

                    <label>

                      Forma de pagamento

                    </label>

                    <select

                      className="form-select"

                      value={

                        formaPagamento

                      }

                      onChange={e =>

                        setFormaPagamento(

                          e.target.value

                        )

                      }

                    >

                      <option>

                        PIX

                      </option>

                      <option>

                        Dinheiro

                      </option>

                      <option>

                        TED

                      </option>

                      <option>

                        Cartão

                      </option>

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

                        dataPagamento

                      }

                      onChange={e =>

                        setDataPagamento(

                          e.target.value

                        )

                      }

                    />

                  </div>

                  <div>

                    <label>

                      Observação

                    </label>

                    <textarea

                      className="form-control"

                      rows="3"

                      value={

                        observacao

                      }

                      onChange={e =>

                        setObservacao(

                          e.target.value

                        )

                      }

                    />

                  </div>

                </div>

                <div className="modal-footer">

                  <button

                    className="btn btn-secondary"

                    onClick={() =>

                      setPagamentoSelecionado(null)

                    }

                  >

                    Cancelar

                  </button>

                  <button

                    className="btn btn-success"

                    onClick={async () => {

                      try {

                        await efetuarPagamento({

                          fechamento:

                            pagamentoSelecionado.fechamento,

                          funcionario:

                            pagamentoSelecionado.funcionario,

                          formaPagamento,

                          dataPagamento,

                          observacao

                        })

                        setPagamentoSelecionado(null)

                        await carregar()

                        alert(

                          'Pagamento registrado com sucesso.'

                        )

                      }

                      catch (erro) {

                        console.error(erro)

                        alert(

                          erro.message

                        )

                      }

                    }}

                  >

                    Confirmar Pagamento

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