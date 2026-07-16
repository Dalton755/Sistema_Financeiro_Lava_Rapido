const RepositorySolicitacoes = {

  salvar(mensagem, documento) {

    documento.itens.forEach(item => {

      const registro = {

        messageId: mensagem.id,

        assunto: mensagem.assunto,

        remetente: mensagem.remetente,

        numeroSolicitacao: item.numeroSolicitacao,

        placa: item.placa,

        fornecedor: documento.cabecalho.fornecedor,

        responsavel: documento.cabecalho.responsavel,

        agencia: documento.cabecalho.agencia,

        dataSolicitacao: documento.cabecalho.dataSolicitacao,

        valor: item.valor,

        origem: "LOCALIZA",

        status: "AGUARDANDO"

      };

      const resposta = Api.post(
        "/importacoes/solicitacoes",
        registro
      );

      Logger.log(resposta);

      if (resposta.sucesso) {

        Gmail.moverParaLabel(

          mensagem,

          CONFIG.LABELS.LOCALIZA_LAVAGEM,

          CONFIG.LABELS.LOCALIZA_PROCESSADO

        );

      } else {

        Gmail.moverParaLabel(

          mensagem,

          CONFIG.LABELS.LOCALIZA_LAVAGEM,

          CONFIG.LABELS.LOCALIZA_ERRO_IMPORTACAO

        );

      }

    });

  }

};