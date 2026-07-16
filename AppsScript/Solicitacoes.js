const Solicitacoes = {

  executar() {

    Processador.executar({

      nome: "IMPORTADOR DE SOLICITAÇÕES",

      labelImportar: CONFIG.GMAIL.SOLICITACOES.IMPORTAR

    });

  }

};