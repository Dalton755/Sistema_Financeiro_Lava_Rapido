const Processador = {

  executar(config) {

    Logger.log("");

    Logger.log("================================");

    Logger.log(config.nome);

    Logger.log("================================");

    const mensagens = Gmail.listarMensagens(

      config.labelImportar

    );

    Logger.log(`Mensagens encontradas: ${mensagens.length}`);

    if (mensagens.length === 0) {

      Logger.log("Nenhuma mensagem encontrada.");

      return;

    }

    for (const mensagem of mensagens) {

      Logger.log("");

      Logger.log("================================");

      Logger.log("PROCESSANDO MENSAGEM");

      Logger.log("================================");

      Logger.log("");

      Logger.log(`ASSUNTO: ${mensagem.assunto}`);

      Logger.log(`REMETENTE: ${mensagem.remetente}`);

      Logger.log(`DATA: ${mensagem.data}`);

      const resultado = SolicitacoesParser.processar(

        mensagem.corpo

      );

      RepositorySolicitacoes.salvar(

        mensagem,

        resultado

      );

      Logger.log("");

      Logger.log("CABEÇALHO");

      Logger.log(

        JSON.stringify(

          resultado.cabecalho,

          null,

          2

        )

      );

      Logger.log("");

      Logger.log("ITENS");

      Logger.log(

        JSON.stringify(

          resultado.itens,

          null,

          2

        )

      );

      Logger.log("");

      Logger.log(`ANEXOS: ${mensagem.anexos.length}`);

    }

  }



};