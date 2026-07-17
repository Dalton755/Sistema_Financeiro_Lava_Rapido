import express from "express";

import {

    carregarDashboard,

    carregarGrafico

} from "../services/dashboard.service.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const { inicio, fim } = req.query;

        const dashboard = await carregarDashboard({

            inicio,

            fim

        });

        return res.json(dashboard);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            sucesso: false,

            erro: error.message

        });

    }

});

router.get(

    "/grafico",

    async (req, res) => {

        try {

            const {

                inicio,

                fim

            } = req.query;

            const dados =

                await carregarGrafico({

                    inicio,

                    fim

                });

            res.json(dados);

        }

        catch (erro) {

            res.status(500).json({

                sucesso: false,

                erro: erro.message

            });

        }

    }

);

export default router;