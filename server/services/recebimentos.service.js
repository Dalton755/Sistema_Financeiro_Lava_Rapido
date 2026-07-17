import {

    listarPagamentosPendentes,

    listarPagamentosPorMessageId,

    atualizarPagamento

} from "../repositories/pagamentos-localiza.repository.js";

import { CATEGORIAS } from "../constants/categorias.js";


import {
    registrarMovimentacao
} from "../repositories/movimentacoes.repository.js";

export async function carregarRecebimentosPendentes() {

    const pagamentos =
        await listarPagamentosPendentes();

    const grupos = {};

    for (const pagamento of pagamentos) {

        if (!grupos[pagamento.message_id]) {

            grupos[pagamento.message_id] = {

                messageId: pagamento.message_id,

                fornecedor: pagamento.fornecedor_nome,

                fornecedorCodigo: pagamento.fornecedor_codigo,

                dataPagamento: pagamento.data_pagamento,

                valorTotal: 0,

                quantidadeNotas: 0,

                itens: []

            };

        }

        grupos[pagamento.message_id].itens.push({

            id: pagamento.id,

            numeroNF: pagamento.numero_nf,

            serie: pagamento.serie,

            dataEmissao: pagamento.data_emissao,

            valorBruto: Number(pagamento.valor_bruto),

            desconto: Number(pagamento.desconto),

            valorLiquido: Number(pagamento.valor_liquido)

        });

        grupos[pagamento.message_id].valorTotal =
            Number(
                (
                    grupos[pagamento.message_id].valorTotal +
                    Number(pagamento.valor_liquido)
                ).toFixed(2)
            );
        grupos[pagamento.message_id].quantidadeNotas++;

    }

    return Object.values(grupos);



}

import { registrarReceita } from "./movimentacoes.service.js";

export async function confirmarRecebimento({

    messageId,

    contaId

}) {

    const pagamentos =
        await listarPagamentosPorMessageId(messageId);

    if (pagamentos.length === 0) {

        throw new Error("Nenhum pagamento pendente encontrado.");

    }

    const valorTotal = pagamentos.reduce(

        (total, pagamento) =>

            total + Number(pagamento.valor_liquido),

        0

    );

    const movimentacao =
        await registrarReceita({

            categoriaId: CATEGORIAS.LAVAGEM,

            contaId,

            origem: "LOCALIZA",

            origemId: messageId,

            descricao: `Recebimento Localiza - ${pagamentos[0].fornecedor_nome}`,

            referencia: messageId,

            valor: Number(valorTotal.toFixed(2)),

            dataMovimento: pagamentos[0].data_pagamento

        });

    let quantidade = 0;

    for (const pagamento of pagamentos) {

        await atualizarPagamento(

            pagamento.id,

            {

                status: "CONFIRMADO",

                conta_id: contaId,

                movimentacao_id: movimentacao.id,

                confirmado_em: new Date()

            }

        );

        quantidade++;

    }
}