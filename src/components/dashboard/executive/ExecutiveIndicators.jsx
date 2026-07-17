import SummaryCard from "../../ui/SummaryCard";

import {

    formatarMoeda

} from "../../../lib/formatadores";

export default function ExecutiveIndicators({

    dados

}) {

    return (

        <div className="row g-3">

            <div className="col-md-3">

                <SummaryCard

                    title="Caixa Atual"

                    value={formatarMoeda(

                        dados.caixaAtual

                    )}

                    icon="bi bi-wallet2"

                    color="primary"

                />

            </div>

            <div className="col-md-3">

                <SummaryCard

                    title="Receitas"

                    value={formatarMoeda(

                        dados.receita

                    )}

                    icon="bi bi-arrow-down-circle"

                    color="success"

                />

            </div>

            <div className="col-md-3">

                <SummaryCard

                    title="Despesas"

                    value={formatarMoeda(

                        dados.despesa

                    )}

                    icon="bi bi-arrow-up-circle"

                    color="danger"

                />

            </div>

            <div className="col-md-3">

                <SummaryCard

                    title="Lucro"

                    value={formatarMoeda(

                        dados.lucro

                    )}

                    icon="bi bi-graph-up-arrow"

                    color={

                        dados.lucro >= 0

                            ? "success"

                            : "danger"

                    }

                />

            </div>

        </div>

    );

}