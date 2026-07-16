import fs from "fs";
import PDFParser from "pdf2json";

const pdf = new PDFParser();

pdf.on("pdfParser_dataReady", data => {
    console.log("LEU O PDF");
});

pdf.on("pdfParser_dataError", err => {
    console.log(err);
});

pdf.parseBuffer(
    fs.readFileSync("./teste.pdf")
);