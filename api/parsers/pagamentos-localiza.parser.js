import { PDFParse } from "pdf-parse";

export async function extrairDadosPagamento(pdfBase64) {

    const buffer = Buffer.from(pdfBase64, "base64");

    console.log("");
    console.log("================================");
    console.log("PDF RECEBIDO");
    console.log("================================");
    console.log("Bytes:", buffer.length);

    const parser = new PDFParse({
        data: buffer
    });

    const resultado = await parser.getText();

    const texto = resultado.text;

    console.log("");
    console.log("================================");
    console.log("TEXTO EXTRAÍDO");
    console.log("================================");
    console.log(texto);

    const codigo = texto.match(
        /Cod\.\s*Fornecedor:\s*(\d+)/i
    );

    const fornecedor = texto.match(
        /Cod\.\s*Fornecedor:\s*\d+\s*-\s*(.+)/i
    );

    const dataPagamento = texto.match(
        /dia\s*(\d{2}\.\d{2}\.\d{4})/i
    );

    await parser.destroy();

    return {

        fornecedorCodigo:
            codigo?.[1] ?? null,

        fornecedorNome:
            fornecedor?.[1]
                ?.split("\n")[0]
                .trim() ?? null,

        dataPagamento:
            dataPagamento?.[1]
                ?.split(".")
                .reverse()
                .join("-") ?? null

    };

}