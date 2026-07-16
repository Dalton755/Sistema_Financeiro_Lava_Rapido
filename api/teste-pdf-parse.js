import { PDFParse } from "pdf-parse";
import fs from "fs";

const buffer = fs.readFileSync("./teste.pdf");

console.log("Bytes:", buffer.length);

const parser = new PDFParse({
    data: buffer
});

const resultado = await parser.getText();

console.log(resultado);