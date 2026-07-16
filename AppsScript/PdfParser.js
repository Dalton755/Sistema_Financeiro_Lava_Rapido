const PdfParser = {

  obterTexto(blobPdf) {

    const arquivo = Drive.Files.insert(
      {
        title: "tmp_pagamento_localiza",
        mimeType: MimeType.GOOGLE_DOCS
      },
      blobPdf
    );

    const texto = DocumentApp
      .openById(arquivo.id)
      .getBody()
      .getText();

    Drive.Files.remove(arquivo.id);

    return texto;

  }

};