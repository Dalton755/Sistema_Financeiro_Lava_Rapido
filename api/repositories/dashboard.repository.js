import { supabase } from "../services/supabase.js";

export async function buscarIndicadoresFinanceiros({

    inicio,

    fim

}) {

    const dataInicio =
        inicio ||
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString().slice(0, 10);

    const dataFim =
        fim ||
        new Date()
            .toISOString()
            .slice(0, 10);



    //-----------------------------------------
    // CONTAS
    //-----------------------------------------

    const {

        data: contas,

        error: erroContas

    } = await supabase

        .schema("financeiro")

        .from("contas")

        .select("saldo_atual")

        .eq("ativo", true);

    if (erroContas) {

        throw erroContas;

    }

    const caixaAtual =

        (contas ?? []).reduce(

            (t, c) =>

                t + Number(c.saldo_atual ?? 0),

            0

        );


    const {
        data: receitaData,
        error: erroReceita
    } = await supabase

        .schema("financeiro")

        .from("movimentacoes")

        .select("valor")

        .eq("tipo", "RECEITA")

        .eq("status", "CONFIRMADO")

        .gte(
            "data_movimento",
            dataInicio
        )

        .lte(
            "data_movimento",
            dataFim
        )

    if (erroReceita) {

        throw erroReceita;

    }

    const receita =

        (receitaData ?? []).reduce(

            (t, m) =>

                t + Number(m.valor),

            0

        );


    const {
        data: despesaData,
        error: erroDespesa
    } = await supabase

        .schema("financeiro")

        .from("movimentacoes")

        .select("valor")

        .eq("tipo", "DESPESA")

        .eq("status", "CONFIRMADO")

        .gte("data_movimento", dataInicio)

        .lte("data_movimento", dataFim);

    if (erroDespesa) {

        throw erroDespesa;

    }

    const despesa =

        (despesaData ?? []).reduce(

            (t, m) =>

                t + Number(m.valor),

            0

        );

    return {

        caixaAtual: Number(caixaAtual.toFixed(2)),

        receita: Number(receita.toFixed(2)),

        despesa: Number(despesa.toFixed(2)),

        lucro: Number((receita - despesa).toFixed(2))

    };

}

export async function buscarGraficoFinanceiro({

    inicio,

    fim

}) {

    const dataInicio =
        inicio ||
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString().slice(0, 10);

    const dataFim =
        fim ||
        new Date()
            .toISOString()
            .slice(0, 10);

    const {

        data,

        error

    } = await supabase

        .schema("financeiro")

        .from("movimentacoes")

        .select(

            "data_movimento,tipo,valor"

        )

        .eq(

            "status",

            "CONFIRMADO"

        )

        .gte(

            "data_movimento",

            dataInicio

        )

        .lte(

            "data_movimento",

            dataFim

        )

        .order(

            "data_movimento",

            {

                ascending: true

            }

        );

    if (error) {

        throw error;

    }

    const dias = {};

    for (const mov of data) {

        const dia = mov.data_movimento;

        if (!dias[dia]) {

            dias[dia] = {

                data: dia,

                receitas: 0,

                despesas: 0

            };

        }

        if (mov.tipo === "RECEITA") {

            dias[dia].receitas += Number(mov.valor);

        } else {

            dias[dia].despesas += Number(mov.valor);

        }

    }

    return Object.values(dias);

}