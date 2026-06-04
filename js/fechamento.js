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

     console.log(
                'PREVIA',
                resultado
              );

    let html = '';

    resultado.forEach(item => {

      html += `

        <div
          class="funcionario">

          <div
            class="funcionario-nome">

            ${item.nome}

          </div>

          <div
            class="funcionario-info">

            Horas:
            ${item.horas}

          </div>

          <div
            class="funcionario-info">

            Valor Hora:
            R$ ${item.valorHora.toFixed(2)}

          </div>

          <div
            class="funcionario-info">

            Bruto:
            R$ ${item.valorBruto.toFixed(2)}

          </div>

          <div
            class="funcionario-info">

            Adiantamentos:
            R$ ${item.adiantamentos.toFixed(2)}

          </div>

          <div
            class="funcionario-info">

            Líquido:
            R$ ${item.valorLiquido.toFixed(2)}

          </div>

        </div>

      `;

    });

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
