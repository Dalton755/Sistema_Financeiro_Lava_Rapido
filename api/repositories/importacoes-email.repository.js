import { supabase } from "../../api/services/supabase.js";

export async function registrarImportacao({

    messageId,

    numeroReferencia,

    assunto,

    remetente,

    tipoImportacao,

    status,

    erro = null

}) {

    const { error } = await supabase

        .schema("operacoes")

        .from("importacoes_email")

        .insert({

            message_id: messageId,

            numero_referencia: numeroReferencia,

            tipo_importacao: tipoImportacao,

            assunto,

            remetente,

            status,

            erro,

            processado_em: new Date().toISOString()

        });

    if (error) {

        throw error;

    }

}