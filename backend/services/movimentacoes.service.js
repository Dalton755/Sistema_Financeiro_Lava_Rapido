import { registrarMovimentacao }
    from "../repositories/movimentacoes.repository.js";

export async function registrarReceita({

    categoriaId,

    contaId,

    origem,

    origemId,

    descricao,

    referencia,

    valor,

    dataMovimento,

    observacao = null,

    titulo = null

}) {

    return await registrarMovimentacao({

        tipo: "RECEITA",

        status: "CONFIRMADO",

        categoriaId,

        contaId,

        origem,

        origemId,

        descricao,

        referencia,

        valor,

        dataMovimento,

        observacao,

        titulo

    });

}