async function carregarFuncionarios() {

  const loja =
    document
      .getElementById('loja')
      .value;

  const funcionarios =
    await apiGet({

      acao:
        'funcionarios-loja',

      loja

    });

  const select =
    document
      .getElementById(
        'funcionario'
      );

  select.innerHTML = '';

  funcionarios.forEach(f => {

    select.innerHTML += `

      <option
        value="${f.id}">

        ${f.nome}

      </option>

    `;

  });

}

window.onload = async () => {

  const hoje = new Date();

  const ano =
    hoje.getFullYear();

  const mes =
    String(
      hoje.getMonth() + 1
    ).padStart(2, '0');

  const dia =
    String(
      hoje.getDate()
    ).padStart(2, '0');

  document
    .getElementById('data')
    .value =
      `${ano}-${mes}-${dia}`;

  await carregarFuncionarios();

};

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

  if (!resultado.sucesso) {

    alert(
      resultado.mensagem ||
      'Erro ao salvar.'
    );

    return;

  }

  alert(
    'Adiantamento salvo com sucesso.'
  );

  document
    .getElementById(
      'valor'
    )
    .value = '';

  document
    .getElementById(
      'observacao'
    )
    .value = '';

}
