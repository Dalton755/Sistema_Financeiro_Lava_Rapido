import api from "./api";

export async function listarContas() {

    const { data } = await api.get("/contas");

    return data;

}

export async function salvarConta(dados) {

    const { data } = await api.post(

        "/contas",

        dados

    );

    return data;

}

export async function atualizarConta(id, dados) {

    const { data } = await api.put(

        `/contas/${id}`,

        dados

    );

    return data;

}

export async function excluirConta(id) {

    const { data } = await api.delete(

        `/contas/${id}`

    );

    return data;

}