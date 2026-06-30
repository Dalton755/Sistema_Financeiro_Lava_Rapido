import Layout from '../components/Layout'

export default function Dashboard() {

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

            1

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Horas Hoje

          </div>

          <div className="kpi-value">

            0h

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Adiantamentos

          </div>

          <div className="kpi-value">

            R$ 0

          </div>

        </div>

        <div className="kpi-card">

          <div className="kpi-label">

            Folha Prevista

          </div>

          <div className="kpi-value">

            R$ 0

          </div>

        </div>

      </div>

      <div className="card-app mt-4 p-4">

        <h5>

          Atividade Recente

        </h5>

        <p className="text-muted">

          Nenhuma movimentação encontrada.

        </p>

      </div>

    </Layout>

  )

}