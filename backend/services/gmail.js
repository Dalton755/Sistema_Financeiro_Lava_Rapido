import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = path.resolve(
    "credentials",
    "token.json"
);

const CREDENTIALS_PATH = path.resolve(
    "credentials",
    "credentials.json"
);

export async function conectarGmail() {

    const credentials = JSON.parse(

        fs.readFileSync(
            CREDENTIALS_PATH,
            "utf8"
        )

    );

    const token = JSON.parse(

        fs.readFileSync(
            TOKEN_PATH,
            "utf8"
        )

    );

    const {

        client_id,
        client_secret,
        redirect_uris

    } = credentials.installed;

    const auth = new OAuth2Client(

        client_id,
        client_secret,
        redirect_uris[0]

    );

    auth.setCredentials(token);

    return google.gmail({

        version: "v1",

        auth

    });

}