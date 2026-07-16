const Anexos = {

  obterTxt(anexos) {

    return anexos.find(anexo =>

      anexo.getName().toLowerCase().endsWith(".txt")

    ) || null;

  },

  obterPdf(anexos) {

    return anexos.find(anexo =>

      anexo.getName().toLowerCase().endsWith(".pdf")

    ) || null;

  },

  obterXml(anexos) {

    return anexos.find(anexo =>

      anexo.getName().toLowerCase().endsWith(".xml")

    ) || null;

  }

};

