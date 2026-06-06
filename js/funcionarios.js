let funcionariosCache = [];

window.onload =
  async () => {

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

  };

async function carregarFuncionarios() {

  const lista =
    await apiGet({

      acao:
        'todos-funcionarios'

    });

  funcionariosCache =
    lista;

  let html = '';

  lista.forEach(item => {

    html += `

      <div
        class="funcionario"
        onclick="editarFuncionario(
          '${item.id}'
        )">

        <div
          class="funcionario-nome">

          ${item.nome}

        </div>

        <div
          class="funcionario-info">

          ${item.cargo}

        </div>

        <div
          class="funcionario-info">

          ${item.loja}

        </div>

        <div
          class="funcionario-info">

          ${item.status}

        </div>

      </div>

    `;

  });

  document
    .getElementById(
      'listaFuncionarios'
    )
    .innerHTML =
      html;

}

function novoFuncionario() {

  document
    .getElementById(
      'funcionarioId'
    )
    .value = '';

  document
    .getElementById(
      'nome'
    )
    .value = '';

  document
    .getElementById(
      'cargo'
    )
    .value = '';

  document
    .getElementById(
      'valorHora'
    )
    .value = '';

  document
    .getElementById(
      'loja'
    )
    .value = 'Loja A';

  document
    .getElementById(
      'status'
    )
    .value = 'Ativo';

  abrirFormulario();

}

function editarFuncionario(id) {

  const item =
    funcionariosCache.find(
      f =>
        String(f.id) ===
        String(id)
    );

  if (!item) return;

  document
    .getElementById(
      'funcionarioId'
    )
    .value =
      item.id;

  document
    .getElementById(
      'nome'
    )
    .value =
      item.nome;

  document
    .getElementById(
      'cargo'
    )
    .value =
      item.cargo;

  document
    .getElementById(
      'valorHora'
    )
    .value =
      item.valorHora;

  document
    .getElementById(
      'loja'
    )
    .value =
      item.loja;

  document
    .getElementById(
      'status'
    )
    .value =
      item.status;

  abrirFormulario();

}

async function salvarFuncionario() {

  const resultado =
    await apiPost({

      acao:
        'salvarFuncionario',

      id:
        document
          .getElementById(
            'funcionarioId'
          )
          .value,

      nome:
        document
          .getElementById(
            'nome'
          )
          .value,

      cargo:
        document
          .getElementById(
            'cargo'
          )
          .value,

      valorHora:
        document
          .getElementById(
            'valorHora'
          )
          .value,

      loja:
        document
          .getElementById(
            'loja'
          )
          .value,

      status:
        document
          .getElementById(
            'status'
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

  fecharFormulario();

  await carregarFuncionarios();

}

function abrirFormulario() {

  document
    .getElementById(
      'overlay'
    )
    .style.display =
      'block';

}

function fecharFormulario() {

  document
    .getElementById(
      'overlay'
    )
    .style.display =
      'none';

}
