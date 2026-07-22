import {

  BrowserRouter,

  Routes,

  Route

}
  from 'react-router-dom'

import Dashboard
  from './pages/Dashboard'

import Funcionarios
  from './pages/Funcionarios'

import Ponto
  from './pages/Ponto'

import Adiantamentos
  from './pages/Adiantamentos'

import Fechamentos
  from './pages/Fechamentos'

import Pagamentos
  from './pages/Pagamentos'

import Financeiro
  from './pages/Financeiro'

import DetalheAdiantamento
  from './pages/DetalheAdiantamento'

import Configuracoes
  from './pages/Configuracoes'

import DetalhePonto
  from './pages/DetalhePonto'

import TesteFechamento
  from './pages/TesteFechamento'

import Historico
  from './pages/Historico'

import HistoricoFechamentos
  from './pages/HistoricoFechamentos'

import DetalheFechamento
  from './pages/DetalheFechamento'

import Contas from "./pages/Contas";

import Recebimentos
  from "./pages/Recebimentos";

import Demonstrativos
  from "./pages/financeiro/DemonstrativosPage";










export function App() {

  console.log('APP NOVO')

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/funcionarios"
          element={<Funcionarios />}
        />

        <Route
          path="/ponto"
          element={<Ponto />}
        />
        <Route
          path="/ponto/:id"
          element={<DetalhePonto />}
        />

        <Route
          path="/adiantamentos"
          element={<Adiantamentos />}
        />

        <Route
          path="/adiantamentos/:id"
          element={<DetalheAdiantamento />}
        />

        <Route
          path="/fechamentos"
          element={<Fechamentos />}
        />

        <Route
          path="/pagamentos"
          element={<Pagamentos />}
        />

        <Route
          path="/financeiro"
          element={<Financeiro />}
        />

        <Route
          path="/configuracoes"
          element={<Configuracoes />}
        />

        <Route
          path="/teste-fechamento"
          element={<TesteFechamento />}
        />

        <Route
          path="/historico-fechamentos"
          element={<HistoricoFechamentos />}
        />

        <Route
          path="/historico"
          element={<Historico />}
        />

        <Route
          path="/historico-fechamentos/:id"
          element={<DetalheFechamento />}
        />

        <Route
          path="/contas"
          element={<Contas />}
        />

        <Route
          path="/recebimentos"
          element={<Recebimentos />}
        />

        <Route
          path="/demonstrativos"
          element={<Demonstrativos />}
        />








      </Routes>

    </BrowserRouter>

  )

}