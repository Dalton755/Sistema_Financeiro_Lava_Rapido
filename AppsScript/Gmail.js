const Gmail = {

listarMensagens(nomeLabel, limite = CONFIG.IMPORTACAO.LOTE_MAXIMO) {

  const label = GmailApp.getUserLabelByName(nomeLabel);

  if (!label) {

    Logger.log(`Label não encontrada: ${nomeLabel}`);

    return [];

  }

  const mensagens = [];

  const threads = label.getThreads(0, limite);

  threads.forEach(thread => {

    thread.getMessages().forEach(message => {

      mensagens.push({

        id: message.getId(),

        assunto: message.getSubject(),

        remetente: message.getFrom(),

        data: message.getDate(),

        corpo: message.getPlainBody(),

        html: message.getBody(),

        anexos: message.getAttachments(),

        thread,

        message

      });

    });

  });

  return mensagens;

},

moverParaLabel(mensagem, origem, destino) {

    const labelOrigem = GmailApp.getUserLabelByName(origem);

    const labelDestino = GmailApp.getUserLabelByName(destino);

    if (labelDestino) {

        mensagem.thread.addLabel(labelDestino);

    }

    if (labelOrigem) {

        mensagem.thread.removeLabel(labelOrigem);

    }

    mensagem.message.markRead();

    mensagem.thread.moveToArchive();

},

marcarComoProcessado(

    thread,

    labelOrigem,

    labelDestino

) {

    const origem = GmailApp.getUserLabelByName(

        labelOrigem

    );

    const destino = GmailApp.getUserLabelByName(

        labelDestino

    );

    if (origem) {

        thread.removeLabel(origem);

    }

    if (destino) {

        thread.addLabel(destino);

    }

    thread.markRead();

    thread.moveToArchive();

},

};