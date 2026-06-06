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

  const hoje =
    new Date();

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
    .getElementById(
      'data'
    )
    .value =
      `${ano}-${mes}-${dia}`;

  const select =
    document
      .getElementById(
        'loja'
      );

  select.innerHTML = '';

  LOJAS.forEach(loja => {

    select.innerHTML += `

      <option
        value="${loja}">

        ${loja}

      </option>

    `;

  });

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

  const botao =
    document.getElementById(
      'btnSalvarAdiantamento'
    );

  const textoOriginal =
    botao.innerText;

  botao.disabled = true;

  botao.innerText =
    'Salvando...';

  try {

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
      '✅ Adiantamento salvo com sucesso.'
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

    await carregarAdiantamentos();

  } catch (erro) {
      console.error(
        'ERRO COMPLETO',
        erro
      );

    console.error(
      erro
    );

    alert(
      'Erro ao salvar.'
    );

  } finally {

    botao.disabled =
      false;

    botao.innerText =
      textoOriginal;

  }

}



async function carregarAdiantamentos() {
  console.log(
  'carregarAdiantamentos iniciou'
  );
  
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

  adiantamentosCache =
  lista;

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

 

}

    document
  .getElementById('data')
  .addEventListener(
    'change',
    carregarAdiantamentos
  );

let adiantamentosCache = [];

function abrirDetalhesAdiantamentos() {

  let html = '';

  adiantamentosCache
    .forEach(item => {

      html += `

        <div
          class="funcionario">

          <div
            class="funcionario-nome">

            ${item.nome || 'Funcionário'}

          </div>

          <div
            class="funcionario-info">

            ${item.data}

          </div>

          <div
            class="funcionario-info">

            R$ ${Number(
              item.valor
            ).toFixed(2)}

          </div>

          <div
            class="funcionario-info">

            ${item.observacao || ''}

          </div>

        </div>

      `;

    });

  document
    .getElementById(
      'detalhesAdiantamentos'
    )
    .innerHTML =
      html;

  document
    .getElementById(
      'overlayAdiantamentos'
    )
    .style.display =
      'block';

}
