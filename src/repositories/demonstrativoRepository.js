import { supabase } from "../lib/supabase";

export async function criarDemonstrativos(demonstrativos) {

    return await supabase
        .schema("financeiro")
        .from("demonstrativos")
        .insert(demonstrativos)
        .select();

}

export async function criarItensDemonstrativos(itens) {

    return await supabase
        .schema("financeiro")
        .from("demonstrativo_itens")
        .insert(itens)
        .select();

}