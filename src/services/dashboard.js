import api from "./api";

import {

    listarRecebimentos

} from "./recebimentos";

export async function listarDashboard(inicio, fim) {

    const params = {};

    if (inicio) {

        params.inicio = inicio;

    }

    if (fim) {

        params.fim = fim;

    }

    const { data } = await api.get(

        "/dashboard",

        {

            params

        }

    );

    return data;

}

export async function carregarGrafico(

    inicio,

    fim

) {

    const { data } = await api.get(

        "/dashboard/grafico",

        {

            params: {

                inicio,

                fim

            }

        }

    );

    return data;

}

export async function buscarAlertas() {

    const alertas = [];

    // Recebimentos pendentes

    const recebimentos =
        await listarRecebimentos();

    const pendentes = recebimentos.length;

    if (pendentes > 0) {

        alertas.push({

            tipo: "danger",

            mensagem: `${pendentes} recebimento(s) aguardando confirmação`

        });

    }

    else {

        alertas.push({

            tipo: "success",

            mensagem: "Nenhum recebimento pendente"

        });

    }

    // Backlog

    alertas.push({

        tipo: "success",

        mensagem: "Nenhum pagamento vencido"

    });

    alertas.push({

        tipo: "success",

        mensagem: "Nenhum fechamento pendente"

    });

    return alertas;

}