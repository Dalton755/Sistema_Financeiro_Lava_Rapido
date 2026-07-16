const PagamentosParser = {

  processar(conteudoTxt) {

    const linhas = conteudoTxt

      .trim()

      .split(/\r?\n/);

    const itens = [];

    for (let i = 1; i < linhas.length; i++) {

      const linha = linhas[i].trim();

      if (!linha) {
        continue;
      }

      if (!/^\d+;/.test(linha)) {
        continue;
      }

      const colunas = linha.split(";");

      itens.push({

        ss: Number(colunas[0]),

        numeroNF: Number(colunas[1]),

        serie: "",

        dataEmissao: this.converterData(colunas[2]),

        valorBruto: this.moeda(colunas[3]),

        irrf: this.moeda(colunas[4]),

        pisCofinsCsll: this.moeda(colunas[5]),

        iss: this.moeda(colunas[6]),

        inss: this.moeda(colunas[7]),

        desconto: this.moeda(colunas[8]),

        valorLiquido: this.moeda(colunas[9])

      });

    }

    return {

      itens

    };

  },

  moeda(valor) {

    return Number(

      valor

        .replace(/\./g, "")

        .replace(",", ".")

    );

  },

  converterData(data) {

    const [

      dia,

      mes,

      ano

    ] = data.split(".");

    return `${ano}-${mes}-${dia}`;

  }

};