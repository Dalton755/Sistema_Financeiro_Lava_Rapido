import { supabase } from "../services/supabase.js";

export async function registrarMovimentacao(dados) {

    const { data, error } = await supabase

        .schema("financeiro")

        .rpc(

            "registrar_movimentacao",

            {

                p_tipo: dados.tipo,

                p_status: dados.status,

                p_categoria_id: dados.categoriaId,

                p_conta_id: dados.contaId,

                p_forma_pagamento_id: dados.formaPagamentoId ?? null,

                p_centro_custo_id: dados.centroCustoId ?? null,

                p_pessoa_id: dados.pessoaId ?? null,

                p_funcionario_id: dados.funcionarioId ?? null,

                p_loja_id: dados.lojaId ?? null,

                p_origem: dados.origem,

                p_origem_id: dados.origemId ?? null,

                p_referencia: dados.referencia ?? null,

                p_descricao: dados.descricao,

                p_observacao: dados.observacao ?? null,

                p_valor: dados.valor,

                p_data_movimento: dados.dataMovimento,

                p_competencia: dados.competencia ?? null,

                p_titulo: dados.titulo ?? null

            }

        );

    if (error) {

        throw error;

    }

    console.log("");

    console.log("RETORNO DA RPC");

    console.log(data);

    console.log("");

    return data;

}