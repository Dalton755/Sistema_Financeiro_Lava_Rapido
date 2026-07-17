import { useState } from "preact/hooks";

import ExecutiveTab from "../../dashboard/tabs/ExecutiveTab";
import FinanceiroTab from "../../dashboard/tabs/FinanceiroTab";
import OperacoesTab from "../../dashboard/tabs/OperacoesTab";
import CustosTab from "../../dashboard/tabs/CustosTab";
import EquipeTab from "../../dashboard/tabs/EquipeTab";
import ClientesTab from "../../dashboard/tabs/ClientesTab";
import AlertasTab from "../../dashboard/tabs/AlertasTab";

export default function DashboardTabs() {

    const [aba, setAba] = useState("executivo");

    return (

        <>

            <div className="d-flex flex-wrap gap-2 mb-4">

                <button
                    className={`btn ${aba === "executivo" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("executivo")}
                >
                    Resumo Executivo
                </button>

                <button
                    className={`btn ${aba === "financeiro" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("financeiro")}
                >
                    Financeiro
                </button>

                <button
                    className={`btn ${aba === "operacoes" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("operacoes")}
                >
                    Operações
                </button>

                <button
                    className={`btn ${aba === "custos" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("custos")}
                >
                    Custos
                </button>

                <button
                    className={`btn ${aba === "equipe" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("equipe")}
                >
                    Equipe
                </button>

                <button
                    className={`btn ${aba === "clientes" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("clientes")}
                >
                    Clientes
                </button>

                <button
                    className={`btn ${aba === "alertas" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba("alertas")}
                >
                    Alertas
                </button>

            </div>

            {aba === "executivo" && <ExecutiveTab />}
            {aba === "financeiro" && <FinanceiroTab />}
            {aba === "operacoes" && <OperacoesTab />}
            {aba === "custos" && <CustosTab />}
            {aba === "equipe" && <EquipeTab />}
            {aba === "clientes" && <ClientesTab />}
            {aba === "alertas" && <AlertasTab />}

        </>

    );

}