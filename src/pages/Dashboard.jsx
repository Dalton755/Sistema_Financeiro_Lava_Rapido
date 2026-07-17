import ExecutiveTab from "../components/dashboard/tabs/ExecutiveTab";
import FinanceiroTab from "../components/dashboard/tabs/FinanceiroTab";
import OperacoesTab from "../components/dashboard/tabs/OperacoesTab";
import CustosTab from "../components/dashboard/tabs/CustosTab";
import EquipeTab from "../components/dashboard/tabs/EquipeTab";
import ClientesTab from "../components/dashboard/tabs/ClientesTab";
import AlertasTab from "../components/dashboard/tabs/AlertasTab";


import { useEffect, useState } from "react";

import { listarDashboard } from "../services/dashboard";

import PageContainer from "../components/ui/PageContainer";

import PageHeader from "../components/ui/PageHeader";

import SummaryCard from "../components/ui/SummaryCard";

import DashboardChart from "../components/dashboard/charts/DashboardChart";

import {

    carregarGrafico,

    buscarAlertas

} from "../services/dashboard";



import DashboardTabs from "../components/ui/tabs/DashboardTabs";

import DashboardNavigation from "../components/dashboard/DashboardNavigation";

import {

  listarMovimentacoes

} from "../services/movimentacoes";

import {

  formatarMoeda

} from "../lib/formatadores";

export default function Dashboard() {

  const [dados, setDados] = useState(null);

  const [

    grafico,

    setGrafico

  ] = useState([]);

  const [

    alertas,

    setAlertas

  ] = useState([]);


  const [

    movimentacoes,

    setMovimentacoes

  ] = useState([]);

  const [abaAtiva, setAbaAtiva] = useState(0);

  useEffect(() => {

    carregar();

  }, []);



  async function carregar() {

    try {

      const [

    resultado,

    serie,

    movimentacoes,

    alertas

] = await Promise.all([

    listarDashboard(),

    carregarGrafico(),

    listarMovimentacoes(),

    buscarAlertas()



      ]);

      setDados(resultado);

      setGrafico(serie);

      setMovimentacoes(movimentacoes);

      setAlertas(alertas);

    }

    catch (erro) {

      console.error(erro);

    }

  }


  return (

    <PageContainer>

      <PageHeader

        title="Dashboard"

        subtitle="Visão geral do financeiro."

      />

      <DashboardNavigation

        ativa={abaAtiva}

        onChange={setAbaAtiva}

      />

      {

        !dados

          ?

          (

            <div className="text-center py-5">

              Carregando...

            </div>

          )

          :

          (

            <>

              {

                abaAtiva === 0 && (

                  <ExecutiveTab

                    dados={dados}

                    grafico={grafico}

                    movimentacoes={movimentacoes}

                    alertas={alertas}

                  />

                )

              }

              {

                abaAtiva === 1 && (

                  <FinanceiroTab />

                )

              }

              {

                abaAtiva === 2 && (

                  <OperacoesTab />

                )

              }

              {

                abaAtiva === 3 && (

                  <CustosTab />

                )

              }

              {

                abaAtiva === 4 && (

                  <EquipeTab />

                )

              }

              {

                abaAtiva === 5 && (

                  <ClientesTab />

                )

              }

              {

                abaAtiva === 6 && (

                  <AlertasTab />

                )

              }

            </>

          )

      }

    </PageContainer>

  )
    ;
}