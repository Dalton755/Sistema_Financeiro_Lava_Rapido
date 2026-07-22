import { supabase }
    from '../lib/supabase'

import {
    listarAdiantamentosEmAbertoFuncionario

}

    from './adiantamentos'


import {
    criarFuncionarioFechamento

}

    from '../factories/funcionarioFechamentoFactory'

import {
    criarFechamento

}

    from '../repositories/fechamentoRepository'


import {
    criarItensFechamento

} from '../repositories/fechamentoItensRepository'

import {
    fecharPontos

}

    from '../repositories/pontoRepository'

import {
    gerarDemonstrativos
}
    from './demonstrativos'


async function obterValorHoraNaData(funcionarioId, data) {

    const { data: registro, error } = await supabase

        .schema('financeiro')

        .from('funcionario_valor_hora')

        .select('valor_hora')

        .eq('funcionario_id', funcionarioId)

        .lte('vigencia_inicio', data)

        .or(`vigencia_fim.is.null,vigencia_fim.gte.${data}`)

        .order('vigencia_inicio', { ascending: false })

        .limit(1)

        .maybeSingle();

    if (error) {

        throw error;

    }

    return Number(registro?.valor_hora ?? 0);

}





export async function listarFechamentos() {

    const {
        data,
        error
    } = await supabase

        .schema('financeiro')

        .from('fechamentos')

        .select('*')

        .order(
            'created_at',
            {
                ascending: false
            }
        )

    if (error)
        throw error

    return data

}

export async function gerarPreviaFechamento({



    tipo,

    lojaId,

    funcionarioId,

    competencia,

    quinzena

}) {

    console.log(">>> GERAR PREVIA FECHAMENTO EXECUTOU <<<");

    let dataInicio
    let dataFim

    const [

        ano,

        mes

    ] = competencia

        .split('-')

        .map(Number)

    if (quinzena === 1) {

        dataInicio =
            new Date(
                ano,
                mes - 1,
                1
            )

        dataFim =
            new Date(
                ano,
                mes - 1,
                15
            )

    }

    else {

        dataInicio =
            new Date(
                ano,
                mes - 1,
                16
            )

        dataFim =
            new Date(
                ano,
                mes,
                0
            )

    }

    const inicio =

        dataInicio
            .toISOString()
            .split('T')[0]

    const fim =

        dataFim
            .toISOString()
            .split('T')[0]

    let consulta =

        supabase

            .schema('financeiro')

            .from('pontos')

            .select(`
                *,
                funcionarios (
                    id,
                    nome,
                    cpf,
                    cargo,
                    valor_hora
                )
            `)

            .gte(
                'data',
                inicio
            )

            .lte(
                'data',
                fim
            )

            .eq(
                'fechado',
                false
            )

    if (

        tipo === 'LOJA'

    ) {

        consulta =

            consulta.eq(
                'loja_id',
                lojaId
            )

    }

    if (

        tipo === 'FUNCIONARIO'

    ) {

        consulta =

            consulta.eq(
                'funcionario_id',
                funcionarioId
            )

    }

    const {

        data: pontos,

        error

    } = await consulta

    console.log("PONTOS:");
    console.log(pontos);

    console.log("FUNCIONARIO DO PRIMEIRO PONTO:");
    console.log(pontos?.[0]?.funcionarios);

    if (error)
        throw error

    const funcionarios = {}

    for (const ponto of pontos) {

        const id = ponto.funcionario_id

        if (!funcionarios[id]) {

            funcionarios[id] =

                criarFuncionarioFechamento(

                    ponto

                )

        }

        const horas = Number(ponto.horas)

        funcionarios[id].horas += horas

        funcionarios[id].pontos.push({

            id: ponto.id,

            data: ponto.data,

            loja: ponto.loja,

            escala: ponto.escala,

            horas,

            horas_extras: Math.max(

                0,

                horas - 8

            ),

            entrada: ponto.entrada,

            saida_almoco: ponto.saida_almoco,

            retorno_almoco: ponto.retorno_almoco,

            saida: ponto.saida

        })

    }

    const listaFuncionarios =

        Object.values(
            funcionarios
        )

    for (

        const funcionario

        of

        listaFuncionarios

    ) {

        funcionario.dias_trabalhados =

            new Set(

                funcionario.pontos.map(

                    ponto => ponto.data

                )

            ).size

        funcionario.horas_extras =

            funcionario.pontos.reduce(

                (total, ponto) => {

                    const horas = Number(ponto.horas)

                    return total + Math.max(horas - 8, 0)

                },

                0

            )

        funcionario.horas_normais =

            funcionario.horas -

            funcionario.horas_extras

        funcionario.horas_trabalhadas =

            funcionario.horas

        funcionario.escala =

            funcionario.pontos[0]?.escala ?? '-'

        let valorBruto = 0;

        for (const ponto of funcionario.pontos) {

            const valorHora = Number(funcionario.valor_hora);

            ponto.valor_hora = valorHora;

            const horas = Number(ponto.horas);

            const horasNormais = Math.min(horas, 8);

            const horasExtras = Math.max(horas - 8, 0);

            valorBruto +=
                (horasNormais * valorHora) +
                (horasExtras * 12);
        }

        funcionario.valor_bruto = Number(

            valorBruto.toFixed(2)

        )

        funcionario.valor_liquido =

            Number(

                (

                    funcionario.valor_bruto -

                    funcionario.valor_adiantamentos

                ).toFixed(2)

            )

    }

    const totalHoras =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.horas,

            0

        )

    const totalHorasNormais =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.horas_normais,

            0

        )

    const totalHorasExtras =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.horas_extras,

            0

        )


    calcularLojaPredominante(

        listaFuncionarios,

        pontos

    )

    await aplicarAdiantamentos(

        listaFuncionarios

    )

    const totalBruto =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.valor_bruto,

            0

        )

    const totalAdiantamentos =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.valor_adiantamentos,

            0

        )

    // Recalcula o líquido de cada funcionário
    for (

        const funcionario

        of

        listaFuncionarios

    ) {

        funcionario.valor_liquido = Number(

            (

                funcionario.valor_bruto -

                funcionario.valor_adiantamentos

            ).toFixed(2)

        )

    }

    const totalLiquido =

        listaFuncionarios.reduce(

            (

                total,

                funcionario

            ) =>

                total +

                funcionario.valor_liquido,

            0

        )

    let lojaNome = null

    if (tipo === 'LOJA') {

        const { data: loja } = await supabase
            .schema('financeiro')
            .from('lojas')
            .select('nome')
            .eq('id', lojaId)
            .single()

        lojaNome = loja?.nome ?? null
    }

    return {

        tipo,

        competencia,

        quinzena,

        lojaId,

        lojaNome,

        funcionarioId,

        inicio,

        fim,

        funcionarios:

            listaFuncionarios,

        totalHorasNormais,

        totalHorasExtras,

        totalHoras,

        totalBruto,

        totalAdiantamentos,

        totalLiquido

    }

}


function calcularLojaPredominante(funcionarios, pontos) {

    for (const funcionario of funcionarios) {

        const resumo = {}

        const pontosFuncionario =

            pontos.filter(

                ponto =>

                    ponto.funcionario_id ===

                    funcionario.funcionario_id

            )

        for (const ponto of pontosFuncionario) {

            if (!resumo[ponto.loja_id]) {

                resumo[ponto.loja_id] = {

                    id: ponto.loja_id,

                    nome: ponto.loja,

                    horas: 0

                }

            }

            resumo[ponto.loja_id].horas +=

                Number(ponto.horas)

        }

        funcionario.resumo_lojas =

            Object.values(resumo)

        funcionario.loja_predominante =

            funcionario.resumo_lojas

                .sort(

                    (a, b) =>

                        b.horas - a.horas

                )[0] || null

    }

}

async function aplicarAdiantamentos(

    funcionarios

) {

    for (

        const funcionario

        of

        funcionarios

    ) {

        const registros =

            await listarAdiantamentosEmAbertoFuncionario(

                funcionario.funcionario_id

            )

        const total =

            registros.reduce(

                (

                    soma,

                    adiantamento

                ) =>

                    soma +

                    Number(

                        adiantamento.valor

                    ),

                0

            )

        funcionario.adiantamentos = {

            quantidade:

                registros.length,

            total,

            registros

        }

        funcionario.valor_adiantamentos =

            total

    }

}

export async function confirmarFechamento(

    previa

) {

    let consulta = supabase
        .schema('financeiro')
        .from('fechamentos')
        .select('id')
        .eq('tipo', previa.tipo)
        .eq('competencia', previa.competencia)
        .eq('quinzena', previa.quinzena)

    if (previa.tipo === 'LOJA') {
        consulta = consulta.eq('loja_id', previa.lojaId)
    }

    if (previa.tipo === 'FUNCIONARIO') {
        consulta = consulta.eq('funcionario_id', previa.funcionarioId)
    }

    const {
        data: fechamentoExistente,
        error: erroConsulta
    } = await consulta.maybeSingle()

    if (

        erroConsulta

    )

        throw erroConsulta

    if (

        fechamentoExistente

    ) {

        throw new Error(

            'Já existe um fechamento para este período.'

        )

    }

    const {

        data: fechamento,

        error

    } = await criarFechamento({

        funcionario_id:

            previa.tipo === 'FUNCIONARIO'

                ? previa.funcionarioId

                : null,

        tipo:

            previa.tipo,

        loja_id:

            previa.tipo === 'LOJA'

                ? previa.lojaId

                : null,

        loja_nome:

            previa.tipo === 'LOJA'

                ? previa.lojaNome

                : null,

        total_funcionarios:

            previa.funcionarios.length,

        competencia:

            previa.competencia,

        quinzena:

            previa.quinzena,

        periodo_inicio:

            previa.inicio,

        periodo_fim:

            previa.fim,

        horas:

            previa.totalHoras,

        valor_hora:
            previa.tipo === "FUNCIONARIO"
                ? previa.funcionarios[0].valor_hora
                : null,

        valor_bruto:

            previa.totalBruto,

        total_adiantamentos:

            previa.totalAdiantamentos,

        valor_liquido:

            previa.totalLiquido,

        status: 'Aberto'

    })

    if (error)

        throw error

    console.log(

        'FECHAMENTO CRIADO',

        fechamento

    )

    const itens =

        previa.funcionarios.map(

            funcionario => ({

                fechamento_id:

                    fechamento.id,

                funcionario_id:

                    funcionario.funcionario_id,

                horas:

                    funcionario.horas,

                valor_hora:

                    funcionario.valor_hora,

                valor_bruto:

                    funcionario.valor_bruto,

                valor_adiantamentos:

                    funcionario.valor_adiantamentos,

                valor_liquido:

                    funcionario.valor_liquido

            })

        )

    const {

        data: itensCriados,

        error: erroItens

    } = await criarItensFechamento(

        itens

    )

    if (

        erroItens

    )

        throw erroItens

    console.log(

        'ITENS CRIADOS',

        itensCriados

    )

    await gerarDemonstrativos(
        fechamento,
        previa
    );

    console.log(
        'DEMONSTRATIVOS GERADOS'
    );

    const idsPontos =

        previa.funcionarios.flatMap(

            funcionario =>

                funcionario.pontos.map(

                    ponto =>

                        ponto.id

                )

        )

    const {

        error: erroPontos

    } = await fecharPontos(

        idsPontos,

        fechamento.id

    )

    if (

        erroPontos

    )

        throw erroPontos

    console.log(

        'PONTOS FECHADOS',

        idsPontos.length

    )

    const idsAdiantamentos =

        previa.funcionarios.flatMap(

            funcionario =>

                funcionario.adiantamentos.registros.map(

                    adiantamento =>

                        adiantamento.id

                )

        )

    if (

        idsAdiantamentos.length > 0

    ) {

        const {

            error: erroAdiantamentos

        } = await supabase

            .schema('financeiro')

            .from('adiantamentos')

            .update({

                status: 'Fechado',

                fechamento_id:

                    fechamento.id

            })

            .in(

                'id',

                idsAdiantamentos

            )

        if (

            erroAdiantamentos

        )

            throw erroAdiantamentos

        console.log(

            'ADIANTAMENTOS FECHADOS',

            idsAdiantamentos.length

        )

    }

    return {

        fechamento,

        itensCriados

    }



}