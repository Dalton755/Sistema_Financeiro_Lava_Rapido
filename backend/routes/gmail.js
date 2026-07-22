import { Router } from "express";
import { conectarGmail } from "../services/gmail.js";

const router = Router();

router.get("/labels", async (req, res) => {

    try {

        const gmail = await conectarGmail();

        const { data } = await gmail.users.labels.list({

            userId: "me"

        });

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: error.message

        });

    }

});

export default router;