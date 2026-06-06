
let quinzenasCache = [];

let pagamentosCache = [];

let pagamentosLojaCache = [];


window.onload = async () => {

  const quinzenas =
    await apiGet({

      acao:
        'listarQuinzenas'

    });

  quinzenasCache =
    quinzenas;

  const select =
    document.getElementById(
      'fechamento'
    );

  select.innerHTML = '';

  quinzenas.forEach(q => {

    select.innerHTML += `

      <option
        value="${q.id}">

        ${q.descricao}

      </option>

    `;

  });

  if (
    quinzenas.length === 0
  ) {

    document
      .getElementById(
        'resumoGeral'
      )
      .innerHTML = `

        <div
          class="funcionario">

          Nenhum fechamento disponível.

        </div>

      `;

    return;

  }

  select.addEventListener(
    'change',
    carregarPainelPagamentos
  );

  await carregarPainelPagamentos();

};

function obterQuinzenaSelecionada() {

  const id =
    document
      .getElementById(
        'fechamento'
      )
      .value;

  return quinzenasCache.find(
    q => q.id === id
  );

}

async function carregarPainelPagamentos() {

  const quinzena =
    obterQuinzenaSelecionada();

  if (!quinzena)
    return;

  const resumo =
    await apiGet({

      acao:
        'resumoPagamentos',

      dataInicio:
        quinzena.dataInicio,

      dataFim:
        quinzena.dataFim

    });

  const lojas =
    await apiGet({

      acao:
        'resumoPagamentosPorLoja',

      dataInicio:
        quinzena.dataInicio,

      dataFim:
        quinzena.dataFim

    });

  renderizarResumo(
    resumo
  );

  renderizarCardsLojas(
    lojas
  );

}

function renderizarResumo(
  resumo
) {

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

          Folha:
          R$ ${resumo.totalFolha.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Pago:
          R$ ${resumo.totalPago.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Pendente:
          R$ ${resumo.totalPendente.toFixed(2)}

        </div>

      </div>

    `;

}

function renderizarCardsLojas(
  lojas
) {

  let html = '';

  lojas.forEach(loja => {

    const status =
      loja.quitado

        ? '🟢 QUITADO'

        : '🔴 PENDENTE';

    html += `

      <div
        class="funcionario"
        onclick="abrirLojaPagamento(
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

          Pago:
          R$ ${loja.pago.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Pendente:
          R$ ${loja.pendente.toFixed(2)}

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

async function carregarPagamentos() {

  const resultado =
    await apiGet({

      acao:
        'listarPagamentos',

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

  let totalPago = 0;

  let totalPendente = 0;

  resultado.forEach(item => {

    if (
      item.status === 'Pago'
    ) {

      totalPago +=
        Number(
          item.valorLiquido
        );

    } else {

      totalPendente +=
        Number(
          item.valorLiquido
        );

    }

  });

  document
    .getElementById(
      'resumo'
    )
    .innerHTML = `

      <div
        class="funcionario">

        <div
          class="funcionario-info">

          Total Pago:
          R$ ${totalPago.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Total Pendente:
          R$ ${totalPendente.toFixed(2)}

        </div>

      </div>

  `;

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

          Líquido:
          R$ ${item.valorLiquido.toFixed(2)}

        </div>

        <div
          class="funcionario-info">

          Status:
          ${item.status}

        </div>

        ${
          item.status === 'Pendente'
          ? `
          <button
            onclick="pagar(
              '${item.fechamentoId}',
              '${item.funcionarioId}'
            )">

            Marcar como Pago

          </button>
          `
          : ''
        }

      </div>

    `;

  });

  document
    .getElementById(
      'listaPagamentos'
    )
    .innerHTML =
      html;

}

async function pagar(
  fechamentoId,
  funcionarioId
) {

  const resultado =
    await apiPost({

      acao:
        'marcarPagamento',

      fechamentoId,

      funcionarioId

    });

  console.log(
  'PAGAMENTO',
  resultado
);

  if (
  !resultado.sucesso
) {

  console.log(
    'RETORNO PAGAMENTO',
    resultado
  );

  alert(
    resultado.mensagem ||
    'Erro ao registrar pagamento.'
  );

  return;

}

  alert(
    'Pagamento registrado.'
  );

  await carregarPagamentos();

}
