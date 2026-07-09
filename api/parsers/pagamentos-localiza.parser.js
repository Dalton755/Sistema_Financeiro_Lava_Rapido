import PDFParser from "pdf2json";

export function extrairDadosPagamento(pdfBase64) {

    return new Promise((resolve, reject) => {

        const pdf = new PDFParser();

        pdf.on("pdfParser_dataError", err => {

            reject(err);

        });

        pdf.on("pdfParser_dataReady", pdfData => {

            console.log("");
            console.log("================================");
            console.log("PDF LIDO COM SUCESSO");
            console.log("================================");

            let texto = "";

            pdfData.Pages.forEach(page => {

                page.Texts.forEach(item => {

                    item.R.forEach(r => {

                        texto += decodeURIComponent(r.T) + " ";

                    });

                });

            });

            console.log("");

            console.log("================================");

            console.log("TEXTO EXTRAÍDO");

            console.log("================================");

            console.log(texto);

            const codigo = texto.match(
                /Cod\.\s*Fornecedor:\s*(\d+)/i
            );

            const fornecedor = texto.match(
                /Cod\.\s*Fornecedor:\s*\d+\s*-\s*(.*?)\s*Comunicamos/i
            );

            const dataPagamento = texto.match(
                /dia\s*(\d{2}\.\d{2}\.\d{4})/i
            );

            resolve({

                fornecedorCodigo: codigo?.[1] ?? null,

                fornecedorNome: fornecedor?.[1]?.trim() ?? null,

                dataPagamento: dataPagamento?.[1]
                    ?.split(".")
                    .reverse()
                    .join("-") ?? null

            });

        });

        pdf.parseBuffer(

            Buffer.from(

                pdfBase64,

                "base64"

            )

        );

    });

}