import { supabase } from "../services/supabase.js";

export async function salvarPagamentos(payload) {

    const { data: existente } = await supabase
        .schema("financeiro")
        .from("pagamentos_localiza")
        .select("id")
        .eq("message_id", payload.messageId)
        .limit(1);

    if (existente.length > 0) {

        return {

            duplicado: true,

            quantidade: 0

        };

    }

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

        .insert(registros)

        .select();

    if (error) {

        throw error;

    }

    return {

        duplicado: false,

        quantidade: data.length

    };

}