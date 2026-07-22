import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testeRoutes from "./routes/teste.js";
import gmailRoutes from "./routes/gmail.js";
import solicitacoesRoutes from "./routes/solicitacoes.js";
import pagamentosLocalizaRoutes from "./routes/pagamentos-localiza.js";
import contas from "./routes/contas.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");

    console.log("================================");

    console.log("SERVIDOR INICIADO");

    console.log("================================");

    console.log(`Rodando na porta ${PORT}`);

});

export default app;

