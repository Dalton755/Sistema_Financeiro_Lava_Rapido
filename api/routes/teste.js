import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

router.get("/", async (req, res) => {

    try {

        const { data, error } = await supabase
            .schema("financeiro")
            .from("lojas")
            .select("*")
            .limit(5);

        return res.json({
            data,
            error
        });

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }

});

export default router;