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

    const { data, error } = await db
        .from("movimentacoes")
        .insert(dados)
        .select()
        .single();

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

