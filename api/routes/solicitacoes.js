import { Router } from "express";
import { salvarSolicitacao } from "../repositories/solicitacoes.repository.js";

const router = Router();

router.post("/", async (req, res) => {

    const resultado = await salvarSolicitacao(req.body);

    if (!resultado.sucesso) {

        return res.status(400).json(resultado);

    }

    res.json(resultado);

});

export default router;