import { supabase }
    from '../lib/supabase'

export async function listarPontos() {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

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

export async function criarPonto(
    ponto
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .insert([
            ponto
        ])

        .select()

        .single()

    if (error)
        throw error

    return data

}

export async function atualizarPonto(
    id,
    ponto
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .update(
            ponto
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

export async function listarPontosPorData(
    data
) {

    const {
        data: pontos,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .select(`
            *,
            funcionarios (
                id,
                nome
            )
        `)

        .eq(
            'data',
            data
        )

    if (error)
        throw error

    return pontos

}

export async function obterUltimaDataPonto() {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .select('data')

        .order(
            'data',
            {
                ascending: false
            }
        )

        .limit(1)

        .single()

    if (error)
        return null

    return data?.data

}

export async function buscarPontoPorId(
    id
) {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

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

export async function excluirPonto(
    id
) {

    const {
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .delete()

        .eq(
            'id',
            id
        )

    if (error)
        throw error

}


export async function listarPontosFuncionarioData(
    funcionarioId,
    data
) {

    const {
        data: pontos,
        error
    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .select('*')

        .eq(
            'funcionario_id',
            funcionarioId
        )

        .eq(
            'data',
            data
        )

    if (error)
        throw error

    return pontos

}

export async function listarPontosPeriodo(

    dataInicio,

    dataFim

) {

    const {

        data,

        error

    } = await supabase

        .schema('financeiro')

        .from('pontos')

        .select(`
            *,
            funcionarios (
                id,
                nome
            )
        `)

        .gte(
            'data',
            dataInicio
        )

        .lte(
            'data',
            dataFim
        )

        .eq(
            'fechado',
            false
        )

    if (error)
        throw error

    return data

}

