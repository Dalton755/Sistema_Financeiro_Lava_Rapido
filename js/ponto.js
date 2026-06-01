window.onload = () => {

  const hoje =
    new Date()
      .toISOString()
      .split('T')[0];

  document
    .getElementById('data')
    .value = hoje;

};

async function carregarDados() {

  const botao = document.querySelector(
    'button[onclick="carregarDados()"]'
  );

  const textoOriginal = botao.innerText;

  botao.disabled = true;
  botao.innerText = 'Carregando...';

  try {

    const data =
      document
        .getElementById('data')
        .value;

    const loja =
      document
        .getElementById('loja')
        .value;

    const resultado =
      await apiGet({

        acao: 'funcionarios-data',

        data,

        loja

      });

    renderizar(resultado);

  } catch (erro) {

    console.error(erro);

    alert(
      'Erro ao carregar os dados.'
    );

  } finally {

    botao.disabled = false;
    botao.innerText = textoOriginal;

  }

}

function renderizar(dados) {

  document
    .getElementById('resumo')
    .innerHTML = `

      <h3>

      Total:
      ${dados.totalFuncionarios}

      | Pendentes:
      ${dados.totalPendentes}

      | Lançados:
      ${dados.totalLancados}

      </h3>

    `;

  let htmlPendentes =
    '<h3>Pendentes</h3>';

  dados.pendentes
    .forEach(item => {

      htmlPendentes += `

        <div>

          ${item.funcionario.nome}

        </div>

      `;

    });

  document
    .getElementById('pendentes')
    .innerHTML =
      htmlPendentes;

  let htmlLancados =
    '<h3>Lançados</h3>';

  dados.lancados
    .forEach(item => {

      htmlLancados += `

        <div>

          ${item.funcionario.nome}

        </div>

      `;

    });

  document
    .getElementById('lancados')
    .innerHTML =
      htmlLancados;

}
