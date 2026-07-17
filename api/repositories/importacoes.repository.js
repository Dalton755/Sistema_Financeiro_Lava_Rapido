import { supabase } from "../../api/services/supabase.js";

export async function registrarImportacao(dados) {

    try {

        const { error } = await supabase

            .schema("operacoes")

            .from("importacoes_email")

            .insert({

                message_id: dados.messageId,

                tipo_importacao: dados.tipoImportacao,

                assunto: dados.assunto,

                remetente: dados.remetente,

                numero_referencia: Number(dados.numeroReferencia),

                status: dados.status,

                erro: dados.erro,

                processado_em: new Date().toISOString()

            });

        if (error) {

            console.error("Erro ao registrar importação:");

            console.error(error);

        }

    } catch (erro) {

        console.error("Erro inesperado ao registrar importação:");

        console.error(erro);

    }

}