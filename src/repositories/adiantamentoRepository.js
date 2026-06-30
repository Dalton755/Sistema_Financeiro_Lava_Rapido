import { supabase } from '../lib/supabase'

export async function listarAdiantamentosPorFechamento(fechamentoId) {

    return await supabase

        .schema('financeiro')

        .from('adiantamentos')

        .select('*')

        .eq('fechamento_id', fechamentoId)

        .order('data')

}