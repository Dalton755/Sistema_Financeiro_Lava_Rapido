import express from "express";
import {
    salvarPagamentos,
    buscarPagamentoPorId,
    atualizarPagamento
} from "../repositories/pagamentos-localiza.repository.js";

import {
    confirmarRecebimento
} from "../services/recebimentos.service.js";

import {
    carregarRecebimentosPendentes
} from "../services/recebimentos.service.js";

import { registrarMovimentacao } from "../services/financeiro.service.js";
import { extrairDadosPagamento } from "../parsers/pagamentos-localiza.parser.js";
import { registrarImportacao } from "../repositories/importacoes-email.repository.js";

const router = express.Router();



router.get("/", async (req, res) => {

    try {

        const recebimentos =
            await carregarRecebimentosPendentes();

        return res.json(recebimentos);

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            sucesso: false,

            erro: error.message

        });

    }

});

router.post("/", async (req, res) => {

    console.log("================================");
    console.log("CHEGOU NO POST");
    console.log("================================");

    try {

        console.log("================================");
        console.log("CORPO DO EMAIL");
        console.log("================================");
        console.log(req.body.corpo);

        console.log("");

        console.log("================================");

        console.log("PAGAMENTO LOCALIZA RECEBIDO");

        console.log("================================");

        console.log(req.body);

        console.log("================================");
        console.log("ITENS RECEBIDOS");
        console.log("================================");
        console.log(JSON.stringify(req.body.itens, null, 2));

        let dadosPdf = {

            fornecedorCodigo: null,

            fornecedorNome: null,

            dataPagamento: null

        };

        try {

            dadosPdf = await extrairDadosPagamento(

                req.body.pdf

            );

        } catch (erro) {

            console.error("Falha ao ler PDF:");

            console.error(erro);

        }

        console.log("");

        console.log("================================");

        console.log("DADOS EXTRAÍDOS");

        console.log("================================");

        console.log(dadosPdf);

        req.body.fornecedorCodigo =
            dadosPdf.fornecedorCodigo;

        req.body.fornecedorNome =
            dadosPdf.fornecedorNome;

        req.body.dataPagamento =
            dadosPdf.dataPagamento;



        const resultado =
            await salvarPagamentos(req.body);

        /*
            await registrarImportacao({

            messageId: req.body.messageId,

            numeroReferencia: req.body.itens[0].numeroNF,

            assunto: req.body.assunto,

            remetente: req.body.remetente,

            tipoImportacao: "PAGAMENTO",

            status: resultado.duplicado

                ? "DUPLICADO"

                : "IMPORTADO"

        });

        */

        return res.json({

            sucesso: true,

            duplicado: resultado.duplicado,

            quantidade: resultado.quantidade

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            sucesso: false,

            erro: error.message

        });

    }

});

router.post("/importar", async (req, res) => {

    try {

        const resposta = await fetch(

            "https://script.google.com/macros/s/AKfycbxN2vz1DIFwi3h0hXo4Dv-AmDjJvuZ3yn65OK33rdVGvx-1gVnpBJj10iT4ufLJvueqoA/exec",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    acao: "IMPORTAR_PAGAMENTOS"

                })

            }

        );

        const resultado = await resposta.json();

        return res.json(resultado);

    }

    catch (erro) {

        console.error(erro);

        return res.status(500).json({

            sucesso: false,

            erro: erro.message

        });

    }

});

router.post("/confirmar", async (req, res) => {

    try {

        const {

            messageId,

            contaId

        } = req.body;

        if (!messageId) {

            return res.status(400).json({

                sucesso: false,

                erro: "messageId é obrigatório."

            });

        }

        if (!contaId) {

            return res.status(400).json({

                sucesso: false,

                erro: "contaId é obrigatório."

            });

        }

        const resultado =
            await confirmarRecebimento({

                messageId,

                contaId

            });

        return res.json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            sucesso: false,

            erro: error.message

        });

    }

});

export default router;

router.post("/:id/confirmar", async (req, res) => {

    try {

        const { id } = req.params;

        const { contaId } = req.body;

        const pagamento =
            await buscarPagamentoPorId(id);

        if (!pagamento) {

            return res.status(404).json({

                sucesso: false,

                erro: "Pagamento não encontrado."

            });

        }

        if (pagamento.movimentacao_id) {

            return res.status(400).json({

                sucesso: false,

                erro: "Pagamento já confirmado."

            });

        }

        return res.json({

            sucesso: true,

            pagamento

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            sucesso: false,

            erro: error.message

        });

    }

});

