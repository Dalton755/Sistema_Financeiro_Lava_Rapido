import {

    ResponsiveContainer,

    LineChart,

    Line,

    CartesianGrid,

    Tooltip,

    XAxis,

    YAxis,

    Legend

} from "recharts";

import Card from "../../ui/Card";

import { formatarMoeda } from "../../../lib/formatadores";

export default function DashboardChart({

    dados

}) {

    console.log(dados);

    return (

        <Card>

            <h5 className="mb-4">

                Evolução Financeira

            </h5>

            <ResponsiveContainer

                width="100%"

                height={350}

            >

                <LineChart

                    data={dados}

                >

                    <CartesianGrid

                        strokeDasharray="3 3"

                    />

                    <XAxis

                        dataKey="data"

                    />

                    <YAxis />

                    <Tooltip

                        formatter={(valor) =>

                            formatarMoeda(valor)

                        }

                    />

                    <Legend />

                    <Line

                        type="monotone"

                        dataKey="receitas"

                        stroke="#198754"

                        strokeWidth={3}

                    />

                    <Line

                        type="monotone"

                        dataKey="despesas"

                        stroke="#dc3545"

                        strokeWidth={3}

                    />

                </LineChart>

            </ResponsiveContainer>

        </Card>

    );

}