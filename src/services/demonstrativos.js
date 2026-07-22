import { supabase } from "../lib/supabase";

import {
    criarDemonstrativos,
    criarItensDemonstrativos
} from "../repositories/demonstrativoRepository";

const VALOR_HORA_EXTRA = 12;


export async function listarDemonstrativos() {

    const { data, error } = await supabase
        .schema("financeiro")
        .from("demonstrativos")
        .select(`
            *,
            fechamento:fechamento_id(
                competencia,
                quinzena
            )
        `)
        .order("funcionario_nome");

    if (error) throw error;

    return data;
}



async function obterValorHoraNaData(funcionarioId, data) {

    const { data: registro, error } = await supabase
        .schema("financeiro")
        .from("funcionario_valor_hora")
        .select("valor_hora")
        .eq("funcionario_id", funcionarioId)
        .lte("vigencia_inicio", data)
        .or(`vigencia_fim.is.null,vigencia_fim.gte.${data}`)
        .order("vigencia_inicio", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw error;
    }

    // Encontrou no histórico
    if (registro) {
        return Number(registro.valor_hora);
    }

    // Não encontrou histórico.
    // Usa o valor atual do funcionário.

    const { data: funcionario, error: erroFuncionario } =
        await supabase
            .schema("financeiro")
            .from("funcionarios")
            .select("valor_hora")
            .eq("id", funcionarioId)
            .single();

    if (erroFuncionario) {
        throw erroFuncionario;
    }

    console.warn(
        `Sem histórico de valor hora para ${data}. Utilizando valor atual do funcionário.`
    );

    return Number(funcionario?.valor_hora ?? 0);
}

export async function gerarDemonstrativos(fechamento, previa) {

    for (const funcionario of previa.funcionarios) {

        console.log(funcionario);

        const horasTrabalhadas =
            funcionario.pontos.reduce(
                (total, ponto) =>
                    total + Number(ponto.horas),
                0
            );

        const horasExtras =
            funcionario.pontos.reduce(
                (total, ponto) =>
                    total + Number(ponto.horas_extras),
                0
            );

        let valorBruto = 0;

        for (const ponto of funcionario.pontos) {

            const valorHora = Number(funcionario.valor_hora);

            const horasNormais = Math.min(Number(ponto.horas), 8);

            const horasExtras = Math.max(Number(ponto.horas) - 8, 0);

            console.log("VALOR_HORA_EXTRA =", VALOR_HORA_EXTRA);

            const valorDia =
                (horasNormais * valorHora) +
                (horasExtras * VALOR_HORA_EXTRA);

            console.log("==============");
            console.log("Data:", ponto.data);
            console.log("Horas:", ponto.horas);
            console.log("Valor Hora:", valorHora);
            console.log("Valor Dia:", valorDia);

            valorBruto += valorDia;

            console.log("Valor Bruto Parcial:", valorBruto);
        }

        console.log("Valor Bruto Final:", valorBruto);

        const adiantamentos =
            Number(funcionario.total_adiantamentos ?? 0);

        const valorLiquido =
            valorBruto - adiantamentos;

        // Cria o cabeçalho do demonstrativo
        const { data: demonstrativos, error } =
            await criarDemonstrativos([

                {
                    fechamento_id: fechamento.id,

                    funcionario_id: funcionario.funcionario_id,

                    funcionario_nome: funcionario.nome,

                    cpf: funcionario.cpf ?? null,

                    cargo: funcionario.cargo ?? null,

                    loja:
                        funcionario.loja_predominante?.nome ??
                        funcionario.loja ??
                        null,

                    horas_trabalhadas: horasTrabalhadas,

                    horas_extras: horasExtras,

                    valor_bruto: valorBruto,

                    adiantamentos: adiantamentos,

                    valor_liquido: valorLiquido
                }
            ]);

        if (error)
            throw error;

        const demonstrativo = demonstrativos[0];

        // Cria o detalhamento diário
        const itens = [];

        for (const ponto of funcionario.pontos) {

            const valorHora = await obterValorHoraNaData(
                funcionario.funcionario_id,
                ponto.data
            );

            itens.push({

                demonstrativo_id: demonstrativo.id,

                ponto_id: ponto.id,

                data: ponto.data,

                loja: ponto.loja,

                escala: ponto.escala,

                entrada: ponto.entrada,

                saida: ponto.saida,

                horas: ponto.horas,

                horas_extras: ponto.horas_extras,

                valor_hora: valorHora,

                valor_dia: Number(

                    (

                        (Math.min(Number(ponto.horas), 8) * valorHora)

                        +

                        (

                            Math.max(Number(ponto.horas) - 8, 0)

                            *

                            VALOR_HORA_EXTRA

                        )

                    ).toFixed(2)

                )

            });

        }

        const { error: erroItens } =
            await criarItensDemonstrativos(itens);

        if (erroItens)
            throw erroItens;
    }

}

export async function buscarDemonstrativo(id) {

    const { data: demonstrativo, error } = await supabase
        .schema("financeiro")
        .from("demonstrativos")
        .select(`
            *,
            fechamento:fechamento_id(
                id,
                competencia,
                quinzena
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    const { data: itens, error: erroItens } = await supabase
        .schema("financeiro")
        .from("demonstrativo_itens")
        .select("*")
        .eq("demonstrativo_id", id)
        .order("data");

    if (erroItens) throw erroItens;

    const totalHoras = itens.reduce(
        (soma, item) => soma + Number(item.horas),
        0
    );

    const totalHorasExtras = itens.reduce(
        (soma, item) => soma + Number(item.horas_extras),
        0
    );

    const valorBruto = itens.reduce(
        (soma, item) => soma + Number(item.valor_dia),
        0
    );

    return {

        demonstrativo,

        itens,

        resumo: {

            totalHoras,

            totalHorasExtras,

            valorBruto

        }

    };

}