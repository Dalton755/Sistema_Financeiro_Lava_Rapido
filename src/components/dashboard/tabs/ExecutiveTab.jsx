import ExecutiveIndicators from "../executive/ExecutiveIndicators";
import ExecutiveChart from "../executive/ExecutiveChart";
import ExecutiveRecebimentos from "../executive/ExecutiveRecebimentos";
import ExecutiveAlertas from "../executive/ExecutiveAlertas";
import ExecutiveMovimentacoes from "../executive/ExecutiveMovimentacoes";

export default function ExecutiveTab({

    dados,

    grafico,

    movimentacoes,

    alertas

}) {

    return (

        <>

            <ExecutiveIndicators

                dados={dados}

            />

            <ExecutiveChart

                grafico={grafico}

            />

            <div className="row mt-4">

                <div className="col-lg-6">

                    <ExecutiveRecebimentos />

                </div>

                <div className="col-lg-6">

                    <ExecutiveAlertas

                        alertas={alertas}

                    />

                </div>

            </div>

            <ExecutiveMovimentacoes

                movimentacoes={movimentacoes}

            />

        </>

    );

}




