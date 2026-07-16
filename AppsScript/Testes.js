function testarAnexos() {

  const mensagens = Gmail.listarMensagens(

    CONFIG.LABELS.LOCALIZA_PAGAMENTOS

  );

  if (!mensagens.length) {

    Logger.log("Nenhuma mensagem encontrada.");

    return;

  }

  const mensagem = mensagens[0];

  const txt = Anexos.obterTxt(mensagem.anexos);

  const conteudo = txt.getDataAsString("UTF-8");

  Logger.log(conteudo);

  const pdf = Anexos.obterPdf(mensagem.anexos);

  Logger.log(txt ? txt.getName() : "TXT não encontrado");

  Logger.log(pdf ? pdf.getName() : "PDF não encontrado");

}

function testarLabel() {

  Logger.log(CONFIG.LABELS.LOCALIZA_PAGAMENTOS);

}

function testarParserPagamento() {

  const txt = `SS;NOTA FISCAL;DATA EMISSAO;VALOR;IRRF;PIS/COFINS/CSLL;ISS;INSS;DESCONTO;VALOR LIQUIDO
902750;6;03.07.2026;1.160,00;0,00;0,00;0,00;0,00;21,11;1.138,89
902749;5;03.07.2026;1.060,00;0,00;0,00;0,00;0,00;19,29;1.040,71`;

  const resultado = PagamentosParser.processar(txt);

  Logger.log("================================");
  Logger.log("RESULTADO DO PARSER");
  Logger.log("================================");

  Logger.log(

    JSON.stringify(

      resultado,

      null,

      2

    )

  );

}

function testarRepositoryPagamento() {

  const mensagens = Gmail.listarMensagens(

    CONFIG.LABELS.LOCALIZA_PAGAMENTOS,

    1

  );

  if (mensagens.length === 0) {

    Logger.log(

      "Nenhuma mensagem encontrada."

    );

    return;

  }

  RepositoryPagamentos.salvar(

    mensagens[0]

  );

}

function testarLeituraPdf() {

  const mensagens = Gmail.listarMensagens(

    CONFIG.LABELS.LOCALIZA_PAGAMENTOS,

    1

  );

  if (mensagens.length === 0) {

    Logger.log("Nenhuma mensagem encontrada.");

    return;

  }

  const pdf = Anexos.obterPdf(

    mensagens[0].anexos

  );

  Logger.log(pdf.getContentType());

  Logger.log("================================");

  Logger.log(pdf.getName());

}

function testarConteudoPdf() {

  const mensagens = Gmail.listarMensagens(
    CONFIG.LABELS.LOCALIZA_PAGAMENTOS,
    1
  );

  const pdf = Anexos.obterPdf(
    mensagens[0].anexos
  );

  const texto = pdf.getDataAsString("UTF-8");

  Logger.log("================================");
  Logger.log(texto);

}

function testarTextoPdf() {

  const mensagens = Gmail.listarMensagens(

    CONFIG.LABELS.LOCALIZA_PAGAMENTOS,

    1

  );

  const pdf = Anexos.obterPdf(

    mensagens[0].anexos

  );

  const texto = PdfParser.obterTexto(pdf);

  Logger.log(texto);

}