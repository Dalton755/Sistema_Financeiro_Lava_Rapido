window.onload =
async function() {

  const hoje =
    new Date();

  document
    .getElementById('data')
    .value =
      hoje
        .toISOString()
        .split('T')[0];

  await carregarFuncionarios();

};

async function carregarFuncionarios() {

  const loja =
    document
      .getElementById(
        'loja'
      )
      .value;

  const resposta =
    await apiGet({

      acao:
        'listarFuncionarios',

      loja

    });

  const select =
    document
      .getElementById(
        'funcionario'
      );

  select.innerHTML = '';

  resposta.forEach(f => {

    select.innerHTML += `

      <option
      value="${f.id}">

      ${f.nome}

      </option>

    `;

  });

}

document
.getElementById('loja')
.addEventListener(
  'change',
  carregarFuncionarios
);

async function salvarAdiantamento() {

  const resultado =
    await apiPost({

      acao:
        'salvarAdiantamento',

      data:
        document
          .getElementById(
            'data'
          )
          .value,

      funcionarioId:
        document
          .getElementById(
            'funcionario'
          )
          .value,

      valor:
        document
          .getElementById(
            'valor'
          )
          .value,

      observacao:
        document
          .getElementById(
            'observacao'
          )
          .value

    });

  if (
    resultado.sucesso
  ) {

    alert(
      'Adiantamento salvo.'
    );

  }

}
