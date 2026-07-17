import DashboardChart from "../charts/DashboardChart";

export default function ExecutiveChart({

    grafico

}) {

    return (

        <div className="row mt-4">

            <div className="col-12">

                <DashboardChart

                    dados={grafico}

                />

            </div>

        </div>

    );

}