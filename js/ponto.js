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
  class="funcionario"
  onclick="abrirFormulario(
    '${item.funcionario.id}',
    '${item.funcionario.nome}'
  )">

  <div class="funcionario-nome">

    ${item.funcionario.nome}

  </div>

  <div class="funcionario-info">

    Pendente

  </div>

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

          ${item.funcionario.nome} - ${item.ponto.horas}h

        </div>

      `;

    });

  document
    .getElementById('lancados')
    .innerHTML =
      htmlLancados;

}
function editarPonto(
  funcionario,
  ponto
)

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

async function salvarPonto() {

  const btn =
    document.getElementById(
      'btnSalvarPonto'
    );

  const textoOriginal =
    btn.innerText;

  btn.disabled = true;
  btn.innerText = 'Salvando...';

  try {

    const payload = {

      acao: 'salvarPonto',

      data:
        document
          .getElementById('data')
          .value,

      funcionarioId:
        document
          .getElementById(
            'funcionarioId'
          )
          .value,

      escala:
        document
          .getElementById(
            'escala'
          )
          .value,

      entrada:
        document
          .getElementById(
            'entrada'
          )
          .value,

      saidaAlmoco:
        document
          .getElementById(
            'saidaAlmoco'
          )
          .value,

      retornoAlmoco:
        document
          .getElementById(
            'retornoAlmoco'
          )
          .value,

      saida:
        document
          .getElementById(
            'saida'
          )
          .value

    };

    const resultado =
      await apiPost(payload);

    if (!resultado.sucesso) {

      alert(
        resultado.mensagem
      );

      return;

    }

    mostrarMensagem(
  '✅ Ponto salvo com sucesso.'
);

    carregarDados();

    document
      .getElementById(
        'formularioPonto'
      )
      .style.display =
        'none';

  } catch (erro) {

    console.error(erro);

    mostrarMensagem(
  '❌ Erro ao salvar.'
);

  } finally {

    btn.disabled = false;

    btn.innerText =
      textoOriginal;

  }

}

[
  'entrada',
  'saidaAlmoco',
  'retornoAlmoco',
  'saida'
].forEach(id => {

  document.addEventListener(
    'input',
    function(e) {

      if (e.target.id === id) {

        calcularHorasTela();

      }

    }
  );

});

function mostrarMensagem(texto) {

  const div =
    document.getElementById(
      'mensagem'
    );

  div.innerText = texto;

  div.style.display =
    'block';

  setTimeout(() => {

    div.style.display =
      'none';

  }, 3000);

}
