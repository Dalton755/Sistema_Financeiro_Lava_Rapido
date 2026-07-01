import { supabase } from '../lib/supabase'

export async function listarFechamentos() {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .select('*')

        .order(

            'created_at',

            {

                ascending: false

            }

        )

}

export async function criarFechamento(

    dados

) {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .insert(

            dados

        )

        .select()

        .single()

}

export async function atualizarFechamento(

    id,

    dados

) {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .update(

            dados

        )

        .eq(

            'id',

            id

        )

}

export async function buscarFechamento(

    id

) {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .select('*')

        .eq(

            'id',

            id

        )

        .single()

}

export async function buscarFechamentoPorId(id) {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .select(`
            *,
            lojas (
                nome
            ),
            funcionarios (
                nome
            )
        `)

        .eq('id', id)

        .single()

}

export async function listarItensFechamento(fechamentoId) {

    return await supabase

        .schema('financeiro')

        .from('fechamento_itens')

        .select(`
            *,
            funcionarios (
                nome
            )
        `)

        .eq('fechamento_id', fechamentoId)

        .order('created_at')

}

export async function atualizarStatusFechamento(

    fechamentoId,

    status

) {

    return await supabase

        .schema('financeiro')

        .from('fechamentos')

        .update({

            status

        })

        .eq(

            'id',

            fechamentoId

        )

}