import { supabase } from "./supabase.js";

export async function atualizarSaldoConta(contaId, valor, tipo) {

    const { data: conta, error } = await supabase

        .schema("financeiro")

        .from("contas")

        .select("id,saldo_atual")

        .eq("id", contaId)

        .single();

    if (error) {

        throw error;

    }

    const saldoAtual = Number(conta.saldo_atual || 0);

    const novoSaldo =

        tipo === "RECEITA"

            ? saldoAtual + Number(valor)

            : saldoAtual - Number(valor);

    const { error: updateError } = await supabase

        .schema("financeiro")

        .from("contas")

        .update({

            saldo_atual: novoSaldo

        })

        .eq("id", contaId);

    if (updateError) {

        throw updateError;

    }

    return novoSaldo;

}

export async function registrarMovimentacao(dados) {

    const { data, error } = await supabase.rpc(

        "registrar_movimentacao",

        {

            p_tipo: dados.tipo,

            p_status: dados.status,

            p_categoria_id: dados.categoria_id,

            p_conta_id: dados.conta_id,

            p_forma_pagamento_id: dados.forma_pagamento_id ?? null,

            p_centro_custo_id: dados.centro_custo_id ?? null,

            p_pessoa_id: dados.pessoa_id ?? null,

            p_funcionario_id: dados.funcionario_id ?? null,

            p_loja_id: dados.loja_id ?? null,

            p_origem: dados.origem,

            p_origem_id: dados.origem_id ?? null,

            p_referencia: dados.referencia ?? null,

            p_descricao: dados.descricao,

            p_observacao: dados.observacao ?? null,

            p_valor: dados.valor,

            p_data_movimento: dados.data_movimento,

            p_competencia: dados.competencia ?? null,

            p_titulo: dados.titulo ?? null

        }

    );

    if (error) {

        throw error;

    }

    return data;

}