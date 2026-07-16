const RepositoryPagamentos = {

  salvar(mensagem) {

    const txt = Anexos.obterTxt(

      mensagem.anexos

    );

    if (!txt) {

      throw new Error(

        "Anexo TXT não encontrado."

      );

    }

    const conteudo = txt.getDataAsString(

      "UTF-8"

    );

    const resultado =

      PagamentosParser.processar(

        conteudo

      );

    const pdf = Anexos.obterPdf(mensagem.anexos);

    Logger.log("================================");
    Logger.log("PDF ENCONTRADO");
    Logger.log("================================");
    Logger.log(pdf.getName());
    Logger.log(pdf.getSize());
    Logger.log(pdf.getContentType());

    const payload = {

      messageId: mensagem.id,

      assunto: mensagem.assunto,

      remetente: mensagem.remetente,

      corpo: mensagem.corpo,

      txt: Utilities.base64Encode(

        txt.getBytes()

      ),

      pdf: Utilities.base64Encode(
        pdf.getBytes()
      ),

      itens: resultado.itens

    };

    const resposta = Api.post(

      "/importacoes/pagamentos-localiza",

      payload

    );

    Logger.log("================================");
    Logger.log("RESPOSTA DA API");
    Logger.log("================================");
    Logger.log(JSON.stringify(resposta, null, 2));

    if (!resposta.sucesso) {

      throw new Error(

        resposta.erro ||

        "Erro ao importar pagamento."

      );

    }

    if (!resposta.sucesso) {

      Gmail.marcarComoProcessado(

        mensagem.thread,

        CONFIG.LABELS.LOCALIZA_PAGAMENTOS,

        CONFIG.LABELS.LOCALIZA_PAGAMENTOS_ERRO

      );

      throw new Error(

        resposta.erro ||

        "Erro ao importar pagamento."

      );

    }

    Gmail.marcarComoProcessado(

      mensagem.thread,

      CONFIG.LABELS.LOCALIZA_PAGAMENTOS,

      CONFIG.LABELS.LOCALIZA_PAGAMENTOS_PROCESSADO

    );

    return resposta;

  }

};