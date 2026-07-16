import { supabase }
    from "../services/supabase.js";

export async function listarContasRepository() {

    const {

        data,

        error

    } = await supabase

        .schema("financeiro")

        .from("contas")

        .select("id,nome")

        .eq("ativo", true)

        .order("nome");

    if (error) {

        throw error;

    }

    return data;

}