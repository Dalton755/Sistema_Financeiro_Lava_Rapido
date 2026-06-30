import { supabase }
    from '../lib/supabase'

export async function listarLojas() {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('lojas')

        .select('*')
        .order(
            'nome'
        )

    if (error)
        throw error

    return data

}

export async function criarLoja(
    loja
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('lojas')

        .insert([
            loja
        ])

        .select()

        .single()

    if (error)
        throw error

    return data

}

export async function atualizarLoja(
    id,
    loja
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('lojas')

        .update(
            loja
        )

        .eq(
            'id',
            id
        )

        .select()

        .single()

    if (error)
        throw error

    return data

}

export async function desativarLoja(id) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('lojas')

        .update({
            status: 'Inativa'
        })

        .eq(
            'id',
            id
        )

        .select()

        .single()

    if (error)
        throw error

    return data

}