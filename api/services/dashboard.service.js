import {

    buscarIndicadoresFinanceiros,

    buscarGraficoFinanceiro

} from "../repositories/dashboard.repository.js";



export async function carregarDashboard({

    inicio,

    fim

}) {

    return await buscarIndicadoresFinanceiros({

        inicio,

        fim

    });

}

export async function carregarGrafico({

    inicio,

    fim

}) {

    return await buscarGraficoFinanceiro({

        inicio,

        fim

    });

}