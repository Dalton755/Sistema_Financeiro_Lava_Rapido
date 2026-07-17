import { supabase } from "../services/supabase.js";

export async function salvarPagamentos(payload) {



    const registros = payload.itens.map(item => ({

        message_id: payload.messageId,

        fornecedor_codigo: payload.fornecedorCodigo,

        fornecedor_nome: payload.fornecedorNome,

        data_pagamento: payload.dataPagamento || null,

        numero_nf: item.numeroNF,

        serie: item.serie,

        data_emissao: item.dataEmissao,

        valor_bruto: item.valorBruto,

        irrf: item.irrf,

        pis_cofins_csll: item.pisCofinsCsll,

        iss: item.iss,

        inss: item.inss,

        desconto: item.desconto,

        valor_liquido: item.valorLiquido,

        origem: "LOCALIZA",

        status: "IMPORTADO"

    }));

    const { data, error } = await supabase

        .schema("financeiro")

        .from("pagamentos_localiza")

        .upsert(
            registros,
            {
                onConflict:
                    "fornecedor_codigo,numero_nf,data_pagamento",
                ignoreDuplicates: true
            }
        )

        .select();

    if (error) {

        throw error;

    }

    return {

    sucesso: true,

    quantidade: data?.length ?? 0

};

}

export async function buscarPagamentoPorId(id) {

    const { data, error } = await supabase

        .schema("financeiro")

        .from("pagamentos_localiza")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        throw error;

    }

    return data;

}

export async function atualizarPagamento(id, dados) {

    const { data, error } = await supabase

        .schema("financeiro")

        .from("pagamentos_localiza")

        .update(dados)

        .eq("id", id)

        .select()

        .single();

    if (error) {

        throw error;

    }

    return data;

}

export async function listarPagamentosPendentes() {

    const { data, error } = await supabase

        .schema("financeiro")

        .from("pagamentos_localiza")

        .select("*")

        .eq("status", "IMPORTADO")

        .order("data_pagamento", {

            ascending: true

        })

        .order("message_id", {

            ascending: true

        });

    if (error) {

        throw error;

    }

    return data ?? [];

}

export async function listarPagamentosPorMessageId(messageId) {

    const { data, error } = await supabase

        .schema("financeiro")

        .from("pagamentos_localiza")

        .select("*")

        .eq("message_id", messageId)

        .eq("status", "IMPORTADO")

        .order("numero_nf", {

            ascending: true

        });

    if (error) {

        throw error;

    }

    return data ?? [];

}