import { supabase } from '../lib/supabase'

export async function criarItensFechamento(
    itens
) {

    return await supabase

        .schema('financeiro')

        .from('fechamento_itens')

        .insert(itens)

        .select()

}