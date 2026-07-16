import { supabase } from "../lib/supabase";

const db = supabase.schema("financeiro");

export async function listarMovimentacoes(filtros = {}) {

    let query = db
        .from("movimentacoes")
        .select(`
            *,
            categorias(id,nome,tipo),
            contas(id,nome)
            
        `)
        .eq("ativo", true)
        .order("data_movimento", {
            ascending: false
        });

    if (filtros.tipo) {
        query = query.eq("tipo", filtros.tipo);
    }

    if (filtros.status) {
        query = query.eq("status", filtros.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data ?? [];
}

export async function listarCategorias(tipo) {

    let query = db
        .from("categorias")
        .select("id,nome,tipo")
        .eq("ativo", true)
        .order("nome");

    if (tipo) {
        query = query.eq("tipo", tipo);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data ?? [];
}

export async function listarContas() {

    const { data, error } = await db
        .from("contas")
        .select("id,nome")
        .eq("ativa", true)
        .order("nome");

    if (error) throw error;

    return data ?? [];
}

export async function salvarMovimentacao(dados) {

    const { data, error } = await supabase

    .schema("financeiro")

    .rpc(

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

        

    if (error) throw error;

    return data;

}

export async function excluirMovimentacao(id) {

    const { error } = await db
        .from("movimentacoes")
        .update({
            ativo: false
        })
        .eq("id", id);

    if (error) throw error;
}

export async function carregarResumoFinanceiro() {

    const { data, error } = await db
        .from("movimentacoes")
        .select("tipo,valor,status")
        .eq("ativo", true)
        .neq("status", "CANCELADO");

    if (error) throw error;

    const receitas = data
        .filter(item => item.tipo === "RECEITA")
        .reduce((total, item) => total + Number(item.valor), 0);

    const despesas = data
        .filter(item => item.tipo === "DESPESA")
        .reduce((total, item) => total + Number(item.valor), 0);

    return {

        receitas,

        despesas,

        saldo: receitas - despesas

    };

}

export async function atualizarMovimentacao(id, dados) {

    const { data, error } = await db

        .from("movimentacoes")

        .update(dados)

        .eq("id", id)

        .select()

        .single();

    if (error) throw error;

    return data;

}

