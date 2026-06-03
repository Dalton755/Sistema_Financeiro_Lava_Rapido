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

async function carregarAdiantamentos() {

  const loja =
    document.getElementById(
      'loja'
    ).value;

  const data =
    document.getElementById(
      'data'
    ).value;

  const lista =
    await apiGet({

      acao:
        'listarAdiantamentos',

      dataInicial:
        data,

      dataFinal:
        data,

      loja

    });

  let html = '';

  lista.forEach(item => {

    html += `

      <div class="funcionario">

        <div class="funcionario-nome">

          R$ ${Number(
            item.valor
          ).toFixed(2)}

        </div>

        <div class="funcionario-info">

          ${item.observacao}

        </div>

      </div>

    `;

  });

  document
    .getElementById(
      'listaAdiantamentos'
    )
    .innerHTML =
      html;

}
