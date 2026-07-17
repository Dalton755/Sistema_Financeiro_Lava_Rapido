import { supabase } from "../services/supabase.js";
import { registrarImportacao } from "./importacoes.repository.js";


export async function salvarSolicitacao(dados) {

    try {

        // =====================================
        // Buscar Loja
        // =====================================

        const { data: loja, error: erroLoja } = await supabase
            .schema("operacoes")
            .from("lojas")
            .select("id")
            .eq("codigo", dados.agencia)
            .single();

        if (erroLoja || !loja) {

            return {

                sucesso: false,

                mensagem: `Loja não encontrada: ${dados.agencia}`

            };

        }

        // =====================================
        // Buscar Tipo Lavagem
        // =====================================

        const { data: tipoLavagem, error: erroTipo } = await supabase
            .schema("operacoes")
            .from("tipos_lavagem")
            .select("id")
            .lte("valor_minimo", dados.valor)
            .gte("valor_maximo", dados.valor)
            .eq("ativo", true)
            .single();

        if (erroTipo || !tipoLavagem) {

            return {

                sucesso: false,

                mensagem: `Tipo de lavagem não encontrado para R$ ${dados.valor}`

            };

        }

        // =====================================
        // Inserção
        // =====================================

        const { data, error } = await supabase
            .schema("operacoes")
            .from("solicitacoes_lavagem")
            .insert({

                numero_solicitacao: Number(dados.numeroSolicitacao),

                placa: dados.placa,

                fornecedor: dados.fornecedor,

                responsavel_localiza: dados.responsavel,

                loja_id: loja.id,

                valor: dados.valor,

                tipo_lavagem_id: tipoLavagem.id,

                origem: dados.origem,

                status: dados.status,

                codigo_agencia: dados.agencia,

                recebida_em: new Date().toISOString()

            })
            .select()
            .single();

        if (error) {

            if (error.code === "23505") {

                await registrarImportacao({

                    messageId: dados.messageId,

                    tipoImportacao: "SOLICITACAO",

                    assunto: dados.assunto,

                    remetente: dados.remetente,

                    numeroReferencia: dados.numeroSolicitacao,

                    status: "DUPLICADO"

                });

                return {

                    sucesso: true,

                    duplicado: true,

                    mensagem: "Solicitação já cadastrada."

                };

            }

            return {

                sucesso: false,

                mensagem: error.message

            };

        }

        await registrarImportacao({

            messageId: dados.messageId,

            tipoImportacao: "SOLICITACAO",

            assunto: dados.assunto,

            remetente: dados.remetente,

            numeroReferencia: dados.numeroSolicitacao,

            status: "SUCESSO"

        });

        return {

            sucesso: true,

            duplicado: false,

            data

        };

    }

    catch (erro) {

        await registrarImportacao({

            messageId: dados.messageId,

            tipoImportacao: "SOLICITACAO",

            assunto: dados.assunto,

            remetente: dados.remetente,

            numeroReferencia: dados.numeroSolicitacao,

            status: "ERRO",

            erro: erro.message

        });

        return {

            sucesso: false,

            mensagem: erro.message

        };

    }

}