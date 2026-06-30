import { supabase }
    from '../lib/supabase'

export async function listarAdiantamentos() {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .select(`
            *,
            funcionarios (
                id,
                nome
            )
        `)

        .order(
            'data',
            {
                ascending: false
            }
        )

    if (error)
        throw error

    return data

}

export async function criarAdiantamento(
    adiantamento
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .insert([
            adiantamento
        ])

        .select()

        .single()

    if (error)
        throw error

    return data

}

export async function atualizarAdiantamento(
    id,
    adiantamento
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .update(
            adiantamento
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

export async function excluirAdiantamento(
    id
) {

    const {
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .delete()

        .eq(
            'id',
            id
        )

    if (error)
        throw error

}

export async function buscarAdiantamentoPorId(
    id
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .select(`
            *,
            funcionarios (
                id,
                nome
            )
        `)

        .eq(
            'id',
            id
        )

        .single()

    if (error)
        throw error

    return data

}

export async function totalAdiantamentosFuncionario(
    funcionarioId
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .select(
            'valor'
        )

        .eq(
            'funcionario_id',
            funcionarioId
        )

        .eq(
            'status',
            'Aberto'
        )

    if (error)
        throw error

    return data.reduce(

        (
            total,
            item
        ) =>

            total +

            Number(
                item.valor
            ),

        0

    )

}

export async function listarAdiantamentosEmAbertoFuncionario(
    funcionarioId
) {

    const {

        data,

        error

    } = await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .select('*')

        .eq(
            'funcionario_id',
            funcionarioId
        )

        .eq(
            'status',
            'Aberto'
        )

    if (error)
        throw error

    return data

}