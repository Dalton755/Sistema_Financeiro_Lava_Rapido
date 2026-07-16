const SolicitacoesParser = {

  processar(corpo) {

  const texto = this.normalizar(corpo);

  return {

    cabecalho: this.extrairCabecalho(texto),

    itens: this.extrairItens(texto)

  };

},

  extrairCabecalho(corpo) {

    return {

      fornecedor: this.valor(

        corpo,

        "Fornecedor:"

      ),

      responsavel: this.valor(

        corpo,

        "Responsável pela Solicitação:"

      ),

      agencia: this.valor(

        corpo,

        "Agencia da Abertura:"

      ),

      dataSolicitacao: this.valor(

        corpo,

        "Data da Abertura da Solicitação:"

      )

    };

  },

  extrairItens(texto) {

  const linhas = texto.split("\n");

  const itens = [];

  const regex = /^(\d+)\s+([A-Z0-9]{7})\s+R\$\s*([\d.,]+)/;

  linhas.forEach(linha => {

    const match = linha.trim().match(regex);

    if (!match) return;

    itens.push({

      numeroSolicitacao: match[1],

      placa: match[2],

      valor: Number(

        match[3]

          .replace(/\./g, "")

          .replace(",", ".")

      )

    });

  });

  return itens;

},

  valor(texto, chave) {

    const regex = new RegExp(

      chave.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +

      "\\s*(.+)"

    );

    const resultado = texto.match(regex);

    return resultado

      ? resultado[1].trim()

      : "";

  },

  normalizar(texto) {

  return texto

    .replace(/\r/g, "")

    .replace(/\*/g, "")

    .replace(/[ \t]+/g, " ")

    .replace(/\n{3,}/g, "\n\n")

    .trim();

},

  

};