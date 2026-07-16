import api from "./api";

export async function listarRecebimentos() {

    const { data } = await api.get(
        "/importacoes/pagamentos-localiza"
    );

    return data;

}

export async function confirmarRecebimento({

    messageId,

    contaId

}) {

    const { data } = await api.post(

        "/importacoes/pagamentos-localiza/confirmar",

        {

            messageId,

            contaId

        }

    );

    return data;

}

export async function listarContasRecebimento() {

    const { data } = await api.get(

        "/contas"

    );

    return data;

}