let periodoAtual =
  'dia';

window.onload =
  async () => {

    const hoje =
      new Date()
        .toISOString()
        .split('T')[0];

    document
      .getElementById(
        'data'
      )
      .value =
      hoje;

    await carregarDashboard();

};

document
  .getElementById(
    'data'
  )
  .addEventListener(
    'change',
    carregarDashboard
  );

async function carregarDashboard() {

  const data =
    document
      .getElementById(
        'data'
      )
      .value;

console.log(
  'PERIODO',
  periodoAtual
);
  
 const dados =
  await apiGet({

    acao:
      'dashboard',

    data,

    periodo:
      periodoAtual

  });

console.log(
  'DASHBOARD',
  dados
);

  renderizarResumo(
    dados.resumo
  );

  renderizarLojas(
    dados.lojas
  );

}

function renderizarResumo(
  resumo
) {

  document
    .getElementById(
      'cardsResumo'
    )
    .innerHTML = `

      <div class="resumo">

        <div class="resumo-card">

          <div class="resumo-numero">

            ${resumo.funcionariosHoje || 0}

          </div>

          <div class="resumo-label">

            Funcionários

          </div>

        </div>

        <div class="resumo-card">

          <div class="resumo-numero">

            ${resumo.horasHoje || 0}

          </div>

          <div class="resumo-label">

            Horas

          </div>

        </div>

        <div class="resumo-card">

          <div class="resumo-numero">

            R$ ${Number(
              resumo.adiantamentosHoje || 0
            ).toFixed(0)}

          </div>

          <div class="resumo-label">

            Adiantamentos

          </div>

        </div>

        <div class="resumo-card">

          <div class="resumo-numero">

            R$ ${Number(
              resumo.folhaPrevista || 0
            ).toFixed(0)}

          </div>

          <div class="resumo-label">

            Folha

          </div>

        </div>

      </div>

    `;

}

function renderizarLojas(
  lojas
) {

  let html = '';

  lojas.forEach(loja => {

    html += `

      <div
        class="card-loja"
        onclick="
          abrirDetalhesLoja(
            '${loja.loja}'
          )
        ">

        <div
          class="funcionario-nome">

          🏢 ${loja.loja}

        </div>

        <br>

        <div
          class="funcionario-info">

          👥 ${loja.funcionarios || 0}

          funcionários

        </div>

        <div
          class="funcionario-info">

          ⏱ ${loja.horas || 0}

          horas

        </div>

        <div
          class="funcionario-info">

          💰 R$ ${Number(
            loja.folhaPrevista || 0
          ).toFixed(2)}

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

function abrirDetalhesLoja(
  loja
) {

  alert(
    'Detalhes: ' +
    loja
  );

}

function alterarPeriodo(
  periodo
) {

  periodoAtual =
    periodo;

  document
    .getElementById(
      'btnDia'
    )
    .classList
    .remove(
      'ativo'
    );

  document
    .getElementById(
      'btnQuinzena'
    )
    .classList
    .remove(
      'ativo'
    );

  if (
    periodo === 'dia'
  ) {

    document
      .getElementById(
        'btnDia'
      )
      .classList
      .add(
        'ativo'
      );

  } else {

    document
      .getElementById(
        'btnQuinzena'
      )
      .classList
      .add(
        'ativo'
      );

  }
  if (
  periodo === 'quinzena'
) {

  document
    .getElementById(
      'blocoData'
    )
    .style.display =
      'none';

  document
    .getElementById(
      'infoPeriodo'
    )
    .style.display =
      'block';

  atualizarInfoQuinzena();

} else {

  document
    .getElementById(
      'blocoData'
    )
    .style.display =
      'block';

  document
    .getElementById(
      'infoPeriodo'
    )
    .style.display =
      'none';

}

  carregarDashboard();

}

function atualizarInfoQuinzena() {

  const hoje =
    new Date();

  const dia =
    hoje.getDate();

  let inicio;
  let fim;
  let titulo;

  if (dia <= 15) {

    titulo =
      '1ª Quinzena';

    inicio =
      '01/' +
      String(
        hoje.getMonth() + 1
      ).padStart(2,'0') +
      '/' +
      hoje.getFullYear();

    fim =
      '15/' +
      String(
        hoje.getMonth() + 1
      ).padStart(2,'0') +
      '/' +
      hoje.getFullYear();

  } else {

    titulo =
      '2ª Quinzena';

    const ultimoDia =
      new Date(
        hoje.getFullYear(),
        hoje.getMonth() + 1,
        0
      ).getDate();

    inicio =
      '16/' +
      String(
        hoje.getMonth() + 1
      ).padStart(2,'0') +
      '/' +
      hoje.getFullYear();

    fim =
      ultimoDia +
      '/' +
      String(
        hoje.getMonth() + 1
      ).padStart(2,'0') +
      '/' +
      hoje.getFullYear();

  }

  document
    .getElementById(
      'tituloPeriodo'
    )
    .innerText =
      titulo;

  document
    .getElementById(
      'datasPeriodo'
    )
    .innerText =
      inicio +
      ' até ' +
      fim;

}
