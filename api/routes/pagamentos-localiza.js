import express from "express";
import { salvarPagamentos } from "../repositories/pagamentos-localiza.repository.js";
import { extrairDadosPagamento } from "../parsers/pagamentos-localiza.parser.js";
import { registrarImportacao } from "../repositories/importacoes-email.repository.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        console.log("");

        console.log("================================");

        console.log("PAGAMENTO LOCALIZA RECEBIDO");

        console.log("================================");

        console.log(req.body);

        const dadosPdf =
            await extrairDadosPagamento(
                req.body.pdf
            );

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

export default router;