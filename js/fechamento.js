let resumoCache = [];

let detalhesLojaCache = [];

window.onload = async () => {

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

  await carregarResumo();

};

document
  .getElementById(
    'dataInicio'
  )
  .addEventListener(
    'change',
    carregarResumo
  );

document
  .getElementById(
    'dataFim'
  )
  .addEventListener(
    'change',
    carregarResumo
  );

async function carregarResumo() {

  const dataInicio =
    document
      .getElementById(
        'dataInicio'
      )
      .value;

  const dataFim =
    document
      .getElementById(
        'dataFim'
      )
      .value;

  document
  .getElementById(
    'cardsLojas'
  )
  .innerHTML = `

    <div
      class="funcionario">

      <div
        class="funcionario-nome">

        ⏳ Carregando...

      </div>

    </div>

  `;

  const painel =
  await apiGet({

    acao:
      'painelFechamento',

    dataInicio,

    dataFim

  });

resumoCache =
  painel.lojas;

renderizarResumoGeral(
  painel.resumoGeral
);

renderizarCards(
  painel.lojas
);

}

function renderizarResumoGeral(
  resumo
) {

  const status =
    resumo.fechado

      ? '🔴 FECHADO'

      : '🟢 ABERTO';

  document
    .getElementById(
      'resumoGeral'
    )
    .innerHTML = `

        <div
          class="funcionario card-resumo">

        <div
          class="funcionario-nome">

          📊 Resumo Geral

        </div>

        <div
          class="funcionario-info">

          Funcionários:
          ${resumo.funcionarios}

        </div>

        <div
          class="funcionario-info">

          Bruto:
          R$ ${resumo.bruto.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Adiantamentos:
          R$ ${resumo.adiantamentos.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Líquido:
          R$ ${resumo.liquido.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          ${status}

        </div>

      </div>

    `;

  if (
    resumo.fechado
  ) {

    document
      .getElementById(
        'acoesFechamento'
      )
      .innerHTML = '';

    return;

  }

  document
    .getElementById(
      'acoesFechamento'
    )
    .innerHTML = `

      <br>

      <button
        id="btnConfirmarGeral"
        onclick="confirmarFechamentoGeral()">

        Confirmar Fechamento Geral

      </button>

    `;

}

function renderizarCards(
  lojas
) {

  let html = '';

  lojas.forEach(loja => {

    const status =
      loja.fechado

        ? '🔴 FECHADO'

        : '🟢 ABERTO';

    const classeCard =

    loja.fechado

    ? 'card-fechado'

    : 'card-aberto';

    html += `

      <div
        class="funcionario ${classeCard}"
        onclick="abrirLoja(
          '${loja.loja}'
        )">

        <div
          class="funcionario-nome">

          🏢 ${loja.loja}

        </div>

        <div
  class="funcionario-info">

  Funcionários:
  ${loja.funcionarios}

</div>

<div
  class="funcionario-info">

  Bruto:
  R$ ${loja.bruto.toFixed(2)}

</div>

<div
  class="funcionario-info">

  Adiantamentos:
  R$ ${loja.adiantamentos.toFixed(2)}

</div>

<div
  class="funcionario-info">

  Líquido:
  R$ ${loja.liquido.toFixed(2)}

</div>

        <div
          class="funcionario-info">

          ${status}

        </div>

      </div>

    `;

  });

  document
    .getElementById(
      'cardsLojas'
    )
    .innerHTML =
    html;

}

async function abrirLoja(
  loja
) {

  const dataInicio =
    document
      .getElementById(
        'dataInicio'
      )
      .value;

  const dataFim =
    document
      .getElementById(
        'dataFim'
      )
      .value;

  const resultado =
    await apiGet({

      acao:
        'detalhesFechamentoLoja',

      loja,

      dataInicio,

      dataFim

    });

  detalhesLojaCache =
    resultado.funcionarios;

  document
    .getElementById(
      'tituloLoja'
    )
    .innerText =
    resultado.loja;

  let html = '';

  resultado.funcionarios
    .forEach(item => {

      html += `

        <div
          class="funcionario"
          onclick="abrirFuncionario(
            '${item.funcionarioId}'
          )">

          <div
            class="funcionario-nome">

            ${item.nome}

          </div>

          <div
            class="funcionario-info">

            R$ ${item.valorLiquido.toFixed(2)}

          </div>

        </div>

      `;

    });

  document
    .getElementById(
      'detalhesLoja'
    )
    .innerHTML =
    html;

  document
    .getElementById(
      'overlayLoja'
    )
    .style.display =
    'block';

}

function abrirFuncionario(
  funcionarioId
) {

  const item =
    detalhesLojaCache.find(
      f =>
      String(
        f.funcionarioId
      ) ===
      String(
        funcionarioId
      )
    );

  if (!item) return;

  document
    .getElementById(
      'detalhesFuncionario'
    )
    .innerHTML = `

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

  document
    .getElementById(
      'overlayFuncionario'
    )
    .style.display =
    'block';

}

function fecharLoja() {

  document
    .getElementById(
      'overlayLoja'
    )
    .style.display =
    'none';

}

function fecharFuncionario() {

  document
    .getElementById(
      'overlayFuncionario'
    )
    .style.display =
    'none';

}

async function confirmarFechamentoGeral() {

  const botao =
    document.getElementById(
      'btnConfirmarGeral'
    );

  botao.disabled = true;

  botao.innerText =
    'Confirmando...';

  try {

    const resultado =
      await apiPost({

        acao:
          'confirmarFechamentoGeral',

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

    if (
      !resultado.sucesso
    ) {

      alert(
        resultado.mensagem ||
        'Erro.'
      );

      return;

    }

    alert(

      `✅ Fechamento concluído.

Lojas processadas:
${resultado.quantidadeLojas}`

    );

    await carregarResumo();

  } finally {

    botao.disabled =
      false;

    botao.innerText =
      'Confirmar Fechamento Geral';

  }

}
