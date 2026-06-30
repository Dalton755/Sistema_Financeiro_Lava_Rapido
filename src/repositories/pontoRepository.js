import { supabase } from '../lib/supabase'

export async function fecharPontos(
    idsPontos,
    fechamentoId
) {

    return await supabase

        .schema('financeiro')

        .from('pontos')

        .update({

            status: 'Fechado',

            fechamento_id: fechamentoId

        })

        .in(

            'id',

            idsPontos

        )

}

export async function reabrirPontos(
    idsPontos
) {

    return await supabase

        .schema('financeiro')

        .from('pontos')

        .update({

            status: 'Aberto',

            fechamento_id: null

        })

        .in(

            'id',

            idsPontos

        )

}

export async function listarPontosPorFechamento(fechamentoId) {

    console.log('ID RECEBIDO:', fechamentoId)

    const resultado = await supabase

        .schema('financeiro')

        .from('pontos')

        .select('*')

        .eq('fechamento_id', fechamentoId)

        .order('data')

    console.log('RESULTADO PONTOS:', resultado)

    return resultado

}