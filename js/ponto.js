let funcionariosAtivos = [];


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

window.onload = async () => {

  const ultimaData =
    await apiGet({

      acao:
        'ultimaDataPonto'

    });

  document
    .getElementById(
      'data'
    )
    .value =
    ultimaData.data;

  await carregarFuncionariosBusca();

  await carregarPainelPonto();

};

document
  .getElementById(
    'loja'
  )
  .addEventListener(
    'change',
    carregarDados
  );

async function carregarDados() {

 const botao =
  document.getElementById(
    'btnCarregar'
  );

let textoOriginal = '';

if (botao) {

  textoOriginal =
    botao.innerText;

  botao.disabled = true;

  botao.innerText =
    'Carregando...';

}

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

   if (botao) {

  botao.disabled = false;

  botao.innerText =
    textoOriginal;

}

  }

}

function renderizar(dados) {

 document
.getElementById('resumo')
.innerHTML = `

<div class="resumo">

  <div class="resumo-card">

    <div class="resumo-numero">
      ${dados.totalFuncionarios}
    </div>

    <div class="resumo-label">
      Total
    </div>

  </div>

  <div class="resumo-card">

    <div class="resumo-numero">
      ${dados.totalPendentes}
    </div>

    <div class="resumo-label">
      Pendentes
    </div>

  </div>

  <div class="resumo-card">

    <div class="resumo-numero">
      ${dados.totalLancados}
    </div>

    <div class="resumo-label">
      Lançados
    </div>

  </div>

</div>

`;





  let htmlLancados =
    '<h3>Lançados</h3>';

  window.lancadosCache = dados.lancados;

  window.lancadosCache =
  dados.lancados.sort(

    (a, b) => {

      const lojaA =
        String(
          a.ponto.loja || ''
        );

      const lojaB =
        String(
          b.ponto.loja || ''
        );

      if (
        lojaA !== lojaB
      ) {

        return lojaA.localeCompare(
          lojaB,
          'pt-BR'
        );

      }

      return a.funcionario.nome
        .localeCompare(
          b.funcionario.nome,
          'pt-BR'
        );

    }

  );
  
  console.log(
  'LANCADOS',
  dados.lancados
);
 dados.lancados.forEach((item, index) => {

  htmlLancados += `

  <div
    class="funcionario"
    onclick="editarPonto(${index})">

    <div class="funcionario-nome">

      ${item.funcionario.nome}

    </div>

    <div class="funcionario-info">

      ${item.ponto.horas} horas

    </div>

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
      'overlay'
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

function editarPonto(index) {

  const item =
    window.lancadosCache[index];

  if (!item) {

    console.error(
      'Item não encontrado',
      index
    );

    return;

  }

  abrirFormulario(
    item.funcionario.id,
    item.funcionario.nome
  );

  document.getElementById(
    'escala'
  ).value =
    item.ponto.escala || '';

  document.getElementById(
    'entrada'
  ).value =
    item.ponto.entrada;

  document.getElementById(
    'saidaAlmoco'
  ).value =
      item.ponto.saidaAlmoco;

  document.getElementById(
    'retornoAlmoco'
  ).value =
      item.ponto.retornoAlmoco;

  document.getElementById(
    'saida'
  ).value =
      item.ponto.saida;

  calcularHorasTela();

}

function converterHora(valor) {

  if (!valor) return '';

  try {

    if (typeof valor === 'string') {

      const partes =
        valor.match(/T(\d{2}):(\d{2})/);

      if (partes) {

        return `${partes[1]}:${partes[2]}`;

      }

    }

    return '';

  } catch (erro) {

    console.error(
      'Erro ao converter hora',
      valor
    );

    return '';

  }

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

    fecharFormulario();

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

document
  .getElementById(
    'data'
  )
  .addEventListener(
    'change',
    carregarPainelPonto
  );

function fecharFormulario() {

  document
    .getElementById(
      'overlay'
    )
    .style.display =
      'none';

}

async function carregarFuncionariosBusca() {

  const lista =
    await apiGet({

      acao:
        'todos-funcionarios'

    });

  funcionariosAtivos =
    lista.filter(

      f =>
        f.status === 'Ativo'

    );

  const datalist =
    document.getElementById(
      'listaFuncionarios'
    );

  datalist.innerHTML = '';

  funcionariosAtivos
    .forEach(f => {

      datalist.innerHTML += `

        <option
          value="${f.nome}">
        </option>

      `;

    });

  const listaModal =
  document.getElementById(
    'listaFuncionariosModal'
  );

listaModal.innerHTML = '';

funcionariosAtivos
  .forEach(f => {

    listaModal.innerHTML += `

      <option
        value="${f.nome}">
      </option>

    `;

  });

}

function abrirPorBusca() {

  const nome =
    document
      .getElementById(
        'buscaFuncionario'
      )
      .value
      .trim();

  if (!nome) {

    alert(
      'Digite o nome do funcionário.'
    );

    return;

  }

  const funcionario =
    funcionariosAtivos.find(

      f =>

        f.nome
          .toLowerCase()
          .trim()

        ===

        nome
          .toLowerCase()
          .trim()

    );

  if (!funcionario) {

    alert(
      'Funcionário não encontrado.'
    );

    return;

  }

  abrirFormulario(

    funcionario.id,

    funcionario.nome

  );

}

document
  .getElementById(
    'filtroFuncionario'
  )
  .addEventListener(
    'input',
    aplicarFiltros
  );

document
  .getElementById(
    'filtroLoja'
  )
  .addEventListener(
    'change',
    aplicarFiltros
  );

function aplicarFiltros() {

  const nome =
    document
      .getElementById(
        'filtroFuncionario'
      )
      .value
      .toLowerCase();

  const loja =
    document
      .getElementById(
        'filtroLoja'
      )
      .value;

  const filtrados =
    window.lancadosCache.filter(
      item => {

        const nomeOk =
          item.funcionario.nome
            .toLowerCase()
            .includes(nome);

        const lojaOk =

          !loja ||

          item.ponto.loja ===
          loja;

        return (
          nomeOk &&
          lojaOk
        );

      }
    );

  renderizarLancados(
    filtrados
  );

}

document
  .getElementById(
    'nomeFuncionarioBusca'
  )
  .addEventListener(
    'change',
    selecionarFuncionario
  );

function selecionarFuncionario() {

  const nome =
    document
      .getElementById(
        'nomeFuncionarioBusca'
      )
      .value
      .trim();

  const funcionario =
    funcionariosAtivos.find(

      f =>

        f.nome
          .toLowerCase()

        ===

        nome
          .toLowerCase()

    );

  if (!funcionario)
    return;

  document
    .getElementById(
      'funcionarioId'
    )
    .value =
    funcionario.id;

}

async function carregarPainelPonto() {

  const data =
    document
      .getElementById(
        'data'
      )
      .value;

  const resultado =
    await apiGet({

      acao:
        'painelPonto',

      data

    });

  renderizarCardsLojas(
    resultado.lojas
  );

}

function renderizarCardsLojas(
  lojas
) {

  let html = '';

  lojas.forEach(loja => {

    const nomes =

      loja.funcionarios
        .slice(0, 5)
        .join('<br>');

    html += `

      <div
        class="card-loja"
        onclick="abrirNovaMarcacao(
          '${loja.loja}'
        )">

        <div
          class="funcionario-nome">

          🏢 ${loja.loja}

        </div>

        <div
          class="funcionario-info">

          ${nomes || '-'}

        </div>

        <br>

        <div
          class="funcionario-info">

          ${loja.quantidade}
          registros

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


let lojaSelecionada = '';

function abrirNovaMarcacao(
  loja
) {

  lojaSelecionada =
    loja;

  document
    .getElementById(
      'lojaTrabalho'
    )
    .value =
    loja;

  document
    .getElementById(
      'overlay'
    )
    .style.display =
    'block';

}
