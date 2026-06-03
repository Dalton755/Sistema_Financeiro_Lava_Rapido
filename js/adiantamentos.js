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
  await carregarAdiantamentos();

};

document
  .getElementById('loja')
  .addEventListener(
    'change',
    async () => {

      await carregarFuncionarios();

      await carregarAdiantamentos();

    }
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
  await carregarAdiantamentos();

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

  console.log(
  'DATA ENVIADA',
  data
);

console.log(
  'LOJA ENVIADA',
  loja
);

  console.log(
  'RETORNO ADIANTAMENTOS',
  lista
);

let total = 0;

lista.forEach(item => {

  total += Number(
    item.valor || 0
  );

});

document
  .getElementById(
    'listaAdiantamentos'
  )
  .innerHTML = `

  <div
    class="funcionario"
    onclick="abrirDetalhesAdiantamentos()">

    <div
      class="funcionario-nome">

      Total de Adiantamentos

    </div>

    <div
      class="funcionario-info">

      R$ ${total.toFixed(2)}

    </div>

  </div>

`;

  document
    .getElementById(
      'listaAdiantamentos'
    )
    .innerHTML =
      html;

}

    document
  .getElementById('data')
  .addEventListener(
    'change',
    carregarAdiantamentos
  );
