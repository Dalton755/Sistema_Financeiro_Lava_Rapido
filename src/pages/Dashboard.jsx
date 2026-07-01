import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

import { carregarDashboard }
  from '../services/dashboard'

export default function Dashboard() {
  const [

    dashboard,

    setDashboard

  ] = useState(null)

  useEffect(() => {

    async function carregar() {

      const dados =

        await carregarDashboard()

      setDashboard(

        dados

      )

    }

    carregar()

  }, [])
  if (!dashboard) {

    return (

      <Layout>

        <div className="text-center p-5">

          Carregando...

        </div>

      </Layout>

    )

  }
  return (

    <Layout>

      <div className="page-header">

        <h1 className="page-title">

          Dashboard

        </h1>

        <p className="page-subtitle">

          Visão geral da operação

        </p>

      </div>

      <div className="kpi-grid">

        <div className="kpi-card">

          <div className="kpi-label">

            Funcionários

          </div>

          <div className="kpi-value">

            {

              dashboard.totalFuncionarios

            }

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Lojas

          </div>

          <div className="kpi-value">

            {

              dashboard.totalLojas

            }

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Pontos

          </div>

          <div className="kpi-value">

            {

              dashboard.totalPontos

            }

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Adiantamentos

          </div>

          <div className="kpi-value">

            R$

            {

              dashboard.totalAdiantamentos

                .toFixed(2)

            }

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Fechamentos

          </div>

          <div className="kpi-value">

            {

              dashboard.fechamentos.length

            }

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Pagamentos

          </div>

          <div className="kpi-value">

            {

              dashboard.totalPagamentos

            }

          </div>

        </div>

      </div>

      <div className="card-app mt-4 p-4">

        <div className="card-app mt-4 p-4">

          <h5>

            Últimos Fechamentos

          </h5>

          <hr />

          {

            dashboard.fechamentos

              .slice(0, 5)

              .map(

                fechamento => (

                  <div

                    key={fechamento.id}

                    className="mb-3"

                  >

                    <strong>

                      {

                        fechamento.lojas?.nome ||

                        'Funcionário'

                      }

                    </strong>

                    <br />

                    {fechamento.competencia}

                    {' • '}

                    {fechamento.quinzena}ª Quinzena

                    <br />

                    <span
                      className={`badge bg-${fechamento.status === 'Pago'
                          ? 'success'
                          : fechamento.status === 'Parcial'
                            ? 'warning'
                            : 'secondary'
                        }`}
                    >

                      {

                        fechamento.status

                      }

                    </span>

                  </div>

                )

              )

          }

        </div>

        <p className="text-muted">

          Nenhuma movimentação encontrada.

        </p>

      </div>

    </Layout>

  )

}