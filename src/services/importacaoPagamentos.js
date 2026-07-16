import api from "./api";

export async function importarPagamentos() {

    const { data } = await api.post(

        "/importacoes/pagamentos-localiza/importar"

    );

    return data;

}