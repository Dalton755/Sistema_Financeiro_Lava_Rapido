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
