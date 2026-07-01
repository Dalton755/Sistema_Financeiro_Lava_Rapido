import { supabase } from '../lib/supabase'

export async function carregarDashboard() {

    const [

        funcionarios,

        lojas,

        pontos,

        adiantamentos,

        fechamentos,

        pagamentos

    ] = await Promise.all([

        supabase
            .schema('financeiro')
            .from('funcionarios')
            .select('id', { count: 'exact' }),

        supabase
            .schema('financeiro')
            .from('lojas')
            .select('id', { count: 'exact' }),

        supabase
            .schema('financeiro')
            .from('pontos')
            .select('id', { count: 'exact' }),

        supabase
            .schema('financeiro')
            .from('adiantamentos')
            .select('valor'),

        supabase
            .schema('financeiro')
            .from('fechamentos')
            .select(`
                *,
                lojas(nome)
            `)
            .order('created_at', { ascending: false }),

        supabase
            .schema('financeiro')
            .from('pagamentos')
            .select('id', { count: 'exact' })

    ])

    return {

        totalFuncionarios:

            funcionarios.count || 0,

        totalLojas:

            lojas.count || 0,

        totalPontos:

            pontos.count || 0,

        totalAdiantamentos:

            adiantamentos.data?.reduce(

                (soma, item) =>

                    soma + Number(item.valor),

                0

            ) || 0,

        fechamentos:

            fechamentos.data || [],

        totalPagamentos:

            pagamentos.count || 0

    }

}