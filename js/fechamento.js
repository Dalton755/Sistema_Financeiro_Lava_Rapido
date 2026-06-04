window.onload = () => {

  const hoje =
    new Date();

  const ano =
    hoje.getFullYear();

  const mes =
    String(
      hoje.getMonth() + 1
    ).padStart(2, '0');

  document
    .getElementById(
      'dataInicio'
    )
    .value =
    `${ano}-${mes}-01`;

  document
    .getElementById(
      'dataFim'
    )
    .value =
    `${ano}-${mes}-15`;

};

async function gerarPrevia() {

  const botao =
    document.getElementById(
      'btnGerar'
    );

  const textoOriginal =
    botao.innerText;

  botao.disabled = true;

  botao.innerText =
    'Calculando...';

  try {
    console.log(
      'Gerando prévia...'
    );
    const resultado =
      await apiGet({

        acao:
          'previaFechamento',

        loja:
          document
            .getElementById(
              'loja'
            )
            .value,

        dataInicio:
          document
            .getElementById(
              'dataInicio'
            )
            .value,

        dataFim:
          document
            .getElementById(
              'dataFim'
            )
            .value

                   
      });

    fechamentoCache =
  resultado;

     console.log(
                'PREVIA',
                resultado
              );

    let totalBruto = 0;

let totalAdiantamentos = 0;

let totalLiquido = 0;

resultado.forEach(item => {

  totalBruto +=
    Number(
      item.valorBruto
    );

  totalAdiantamentos +=
    Number(
      item.adiantamentos
    );

  totalLiquido +=
    Number(
      item.valorLiquido
    );

});

let html = `

  <div class="funcionario">

    <div
      class="funcionario-nome">

      Resumo do Fechamento

    </div>

    <div
      class="funcionario-info">

      Funcionários:
      ${resultado.length}

    </div>

    <div
      class="funcionario-info">

      Bruto Total:
      R$ ${totalBruto.toFixed(2)}

    </div>

    <div
      class="funcionario-info">

      Adiantamentos:
      R$ ${totalAdiantamentos.toFixed(2)}

    </div>

    <div
      class="funcionario-info">

      Líquido Total:
      R$ ${totalLiquido.toFixed(2)}

    </div>

  </div>

  <h3>
    Funcionários
  </h3>

`;

    resultado.forEach(item => {

  html += `

    <div
      class="funcionario"
      onclick="abrirDetalhesFechamento(
        '${item.funcionarioId}'
      )">

      <div
        class="funcionario-nome">

        ${item.nome}

      </div>

      <div
        class="funcionario-info">

        Líquido:
        R$ ${item.valorLiquido.toFixed(2)}

      </div>

    </div>

  `;

});

html += `

  <button
    id="btnConfirmar"
    onclick="confirmarFechamento()">

    Confirmar Fechamento

  </button>

`;

    document
  .getElementById(
    'resultado'
  )
  .innerHTML =
  html;

   } catch (erro) {

  console.error(
    'ERRO FECHAMENTO',
    erro
  );

  alert(
    'Erro ao gerar prévia.'
  );

} finally {

  botao.disabled =
    false;

  botao.innerText =
    textoOriginal;

}

}  

let fechamentoCache = [];

function abrirDetalhesFechamento(
  funcionarioId
) {

  const item =
    fechamentoCache.find(
      x =>
      String(
        x.funcionarioId
      ) ===
      String(
        funcionarioId
      )
    );

  if (!item) return;

  alert(

`Funcionário:
${item.nome}

Horas:
${item.horas}

Valor Hora:
R$ ${item.valorHora.toFixed(2)}

Bruto:
R$ ${item.valorBruto.toFixed(2)}

Adiantamentos:
R$ ${item.adiantamentos.toFixed(2)}

Líquido:
R$ ${item.valorLiquido.toFixed(2)}`

  );

}
