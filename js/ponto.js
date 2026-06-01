const ESCALAS = {

  '07-16': {
    entrada: '07:00',
    saidaAlmoco: '12:00',
    retornoAlmoco: '13:00',
    saida: '16:00'
  },

  '08-17': {
    entrada: '08:00',
    saidaAlmoco: '12:00',
    retornoAlmoco: '13:00',
    saida: '17:00'
  },

  '12-20': {
    entrada: '12:00',
    saidaAlmoco: '17:00',
    retornoAlmoco: '18:00',
    saida: '20:00'
  },

  '14-21': {
    entrada: '14:00',
    saidaAlmoco: '17:00',
    retornoAlmoco: '18:00',
    saida: '21:00'
  }

};

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

  const botao =
  document.getElementById(
    'btnCarregar'
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

  <div
    onclick="abrirFormulario(
      '${item.funcionario.id}',
      '${item.funcionario.nome}'
    )"
    style="
      padding:10px;
      margin:5px 0;
      border:1px solid #ddd;
      cursor:pointer;
    ">

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

function abrirFormulario(
  funcionarioId,
  nome
) {

  document
    .getElementById(
      'formularioPonto'
    )
    .style.display =
      'block';

  document
    .getElementById(
      'funcionarioId'
    )
    .value =
      funcionarioId;

  document
    .getElementById(
      'nomeFuncionario'
    )
    .innerText =
      nome;

}

document.addEventListener(
  'change',
  function(e) {

    if (
      e.target.id !== 'escala'
    ) return;

    const escala =
      ESCALAS[
        e.target.value
      ];

    if (!escala) return;

    document.getElementById(
      'entrada'
    ).value =
      escala.entrada;

    document.getElementById(
      'saidaAlmoco'
    ).value =
      escala.saidaAlmoco;

    document.getElementById(
      'retornoAlmoco'
    ).value =
      escala.retornoAlmoco;

    document.getElementById(
      'saida'
    ).value =
      escala.saida;

    calcularHorasTela();

  }
);

function calcularHorasTela() {

  const entrada =
    document.getElementById(
      'entrada'
    ).value;

  const saidaAlmoco =
    document.getElementById(
      'saidaAlmoco'
    ).value;

  const retornoAlmoco =
    document.getElementById(
      'retornoAlmoco'
    ).value;

  const saida =
    document.getElementById(
      'saida'
    ).value;

  if (
    !entrada ||
    !saidaAlmoco ||
    !retornoAlmoco ||
    !saida
  ) return;

  const inicio =
    new Date(
      `2000-01-01 ${entrada}`
    );

  const almocoInicio =
    new Date(
      `2000-01-01 ${saidaAlmoco}`
    );

  const almocoFim =
    new Date(
      `2000-01-01 ${retornoAlmoco}`
    );

  const fim =
    new Date(
      `2000-01-01 ${saida}`
    );

  const horas =

    (
      (
        almocoInicio -
        inicio
      )

      +

      (
        fim -
        almocoFim
      )

    ) / 3600000;

  document
    .getElementById(
      'horas'
    )
    .value =
      horas.toFixed(2);

}
