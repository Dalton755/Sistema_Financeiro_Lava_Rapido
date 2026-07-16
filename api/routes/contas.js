import express from "express";
import { listarContas } from "../services/contas.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const contas = await listarContas();

        res.json(contas);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            sucesso: false,
            erro: error.message

        });

    }

});

export default router;