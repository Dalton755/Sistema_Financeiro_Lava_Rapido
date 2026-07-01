import { supabase } from '../lib/supabase'

export async function registrarPagamento(dados) {

    return await supabase

        .schema('financeiro')

        .from('pagamentos')

        .insert(dados)

        .select()

        .single()

}

export async function listarPagamentos() {

    return await supabase

        .schema('financeiro')

        .from('pagamentos')

        .select(`
            *,
            funcionarios (
                nome
            ),
            lojas (
                nome
            )
        `)

        .order('data_pagamento', {

            ascending: false

        })

}