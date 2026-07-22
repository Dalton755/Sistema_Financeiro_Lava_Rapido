import { authenticate } from "@google-cloud/local-auth";
import fs from "fs";
import path from "path";

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
];

async function autenticar() {

    const auth = await authenticate({

        scopes: SCOPES,

        keyfilePath: path.resolve(
            "credentials",
            "credentials.json"
        )

    });

    const credentials = auth.credentials;

    fs.writeFileSync(

        path.resolve(
            "credentials",
            "token.json"
        ),

        JSON.stringify(credentials, null, 2)

    );

    console.log("================================");

    console.log("TOKEN GERADO COM SUCESSO");

    console.log("================================");

}

autenticar();