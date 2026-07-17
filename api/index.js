import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testeRoutes from "../server/routes/teste.js";
import gmailRoutes from "../server/routes/gmail.js";
import solicitacoesRoutes from "../server/routes/solicitacoes.js";
import pagamentosLocalizaRoutes from "../server/routes/pagamentos-localiza.js";
import contas from "../server/routes/contas.js";
import dashboardRoutes
    from "../server/routes/dashboard.routes.js";


dotenv.config();

const app = express();

app.set("trust proxy", true);


app.use(cors());

app.use(express.json());

app.use((req, res, next) => {

    console.log("");

    console.log("================================");

    console.log("REQUISIÇÃO RECEBIDA");

    console.log("================================");

    console.log(req.method);

    console.log(req.originalUrl);

    next();

});

app.use("/teste", testeRoutes);

app.use("/gmail", gmailRoutes);

app.use("/importacoes/solicitacoes", solicitacoesRoutes);

app.use("/importacoes/pagamentos-localiza", pagamentosLocalizaRoutes);

app.use("/contas", contas);

app.use(

    "/dashboard",

    dashboardRoutes

);

app.get("/", (req, res) => {

    res.json({

        sistema: "Sistema Financeiro Lava Rápido",

        api: "Financeiro Integrações",

        status: "ONLINE",

        versao: "1.0.0"

    });

});

app.get("/health", (req, res) => {

    res.json({

        status: "OK",

        data: new Date()

    });

});

export default app;

