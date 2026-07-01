import {
    listarFechamentos,
    listarItensFechamento,
    atualizarStatusFechamento
} from '../repositories/fechamentoRepository'

import { supabase } from '../lib/supabase'

import {
    listarPagamentos
}
    from '../repositories/pagamentoRepository'




export async function listarPagamentosPendentes() {

    const {

        data: fechamentos,

        error

    } = await listarFechamentos()

    if (error)

        throw error

    const resultado = []

    for (const fechamento of fechamentos) {

        if (

            fechamento.status === 'Pago'

        ) continue

        const {

            data: itens,

            error: erroItens

        } = await listarItensFechamento(

            fechamento.id

        )

        if (

            erroItens

        )

            throw erroItens

        const {

            data: pagamentos,

            error: erroPagamentos

        } = await supabase

            .schema('financeiro')

            .from('pagamentos')

            .select('funcionario_id')

            .eq(

                'fechamento_id',

                fechamento.id

            )

        if (

            erroPagamentos

        )

            throw erroPagamentos

        const funcionariosPagos =

            pagamentos.map(

                pagamento =>

                    pagamento.funcionario_id

            )

        const pendentes =

            itens.filter(

                item =>

                    !funcionariosPagos.includes(

                        item.funcionario_id

                    )

            )

        if (

            pendentes.length > 0

        ) {

            resultado.push({

                ...fechamento,

                itens: pendentes

            })

        }

    }

    return resultado

}

export async function registrarPagamento(payload) {

    const { data, error } = await supabase
        .schema('financeiro')
        .from('pagamentos')
        .insert(payload)
        .select()
        .single()

    if (error) throw error

    return data
}

export async function efetuarPagamento({

    fechamento,

    funcionario,

    formaPagamento,

    dataPagamento,

    observacao

}) {

    const pagamento = await registrarPagamento({

        fechamento_id: fechamento.id,

        funcionario_id: funcionario.funcionario_id,

        loja_id: fechamento.loja_id,

        competencia: fechamento.competencia,

        quinzena: fechamento.quinzena,

        valor: funcionario.valor_liquido,

        forma_pagamento: formaPagamento,

        data_pagamento: dataPagamento,

        observacao,

        usuario: 'Sistema'

    })

    await atualizarStatus(

        fechamento.id

    )

    return pagamento

}

export async function listarHistoricoPagamentos() {

    const {

        data,

        error

    } = await listarPagamentos()

    if (error)

        throw error

    return data

}

export async function atualizarStatus(

    fechamentoId

) {

    const {

        data: itens,

        error: erroItens

    } = await listarItensFechamento(

        fechamentoId

    )

    if (

        erroItens

    )

        throw erroItens

    const {

        data: pagamentos,

        error: erroPagamentos

    } = await listarPagamentos()

    if (

        erroPagamentos

    )

        throw erroPagamentos

    const pagos = pagamentos.filter(

        pagamento =>

            pagamento.fechamento_id ===

            fechamentoId

    ).length

    let status = 'Aberto'

    if (

        pagos > 0

    )

        status = 'Parcial'

    if (

        pagos === itens.length

    )

        status = 'Pago'

    await atualizarStatusFechamento(

        fechamentoId,

        status

    )

}