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

  console.log(
  'ULTIMA DATA',
  ultimaData
);

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

       loja:
        document
          .getElementById(
            'lojaTrabalho'
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

    await carregarPainelPonto();

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
    'input',
    carregarPainelPonto
  );

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

 const campoData =
  document.getElementById(
    'data'
  );

console.log(
  'VALOR INPUT',
  campoData.value
);

const data =
  campoData.value;

  console.log(
    'DATA ENVIADA',
    data
  );

  const resultado =
    await apiGet({

      acao:
        'painelPonto',

      data

    });

  console.log(
    'PAINEL',
    resultado
  );

  renderizarCardsLojas(
    resultado.lojas
  );

}

function detalhesPontoLoja(
  data,
  loja
) {

  const sheet =
    getSpreadsheet()
      .getSheetByName(
        CONFIG.ABA_PONTO
      );

  const dados =
    sheet
      .getDataRange()
      .getValues();

  const funcionarios =
    listarTodosFuncionarios();

  const resultado = [];

  dados
    .slice(1)
    .forEach(linha => {

      const dataLinha =
        Utilities.formatDate(
          new Date(
            linha[1]
          ),
          Session.getScriptTimeZone(),
          'yyyy-MM-dd'
        );

      if (
        dataLinha !== data
      ) return;

      if (
        linha[3] !== loja
      ) return;

      const funcionario =
        funcionarios.find(
          f =>
          String(f.id) ===
          String(linha[2])
        );

      resultado.push({

        nome:
          funcionario
            ? funcionario.nome
            : 'Funcionário',

        escala:
          linha[4],

        entrada:
          linha[5],

        saida:
          linha[8],

        horas:
          linha[9]

      });

    });

  return resultado;

}

function renderizarCardsLojas(
  lojas
) {

  let html = '';

  lojas.forEach(loja => {

    let nomes = '';

    loja.funcionarios
      .slice(0, 5)
      .forEach(nome => {

        nomes += `
          <div
            class="funcionario-info">

            ${nome}

          </div>
        `;

      });

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

        <br>

        ${nomes || `
          <div
            class="funcionario-info">

            Nenhum registro

          </div>
        `}

        <br>

        <div
          class="funcionario-info">

          ${loja.quantidade}
          registros

          <br><br>

<button
  onclick="event.stopPropagation();
           verPontosLoja(
             '${loja.loja}'
           )">

  Ver Pontos

</button>

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

  console.log(
    'LOJA CARD',
    loja
  );

  lojaSelecionada =
    loja;

  document
    .getElementById(
      'lojaTrabalho'
    )
    .value =
    loja;

  console.log(
    'LOJA SELECT',
    document
      .getElementById(
        'lojaTrabalho'
      )
      .value
  );

  document
    .getElementById(
      'overlay'
    )
    .style.display =
    'block';

}


async function verPontosLoja(
  loja
) {

  const data =
    document
      .getElementById(
        'data'
      )
      .value;

  const lista =
    await apiGet({

      acao:
        'detalhesPontoLoja',

      data,

      loja

    });

  document
    .getElementById(
      'tituloPontosLoja'
    )
    .innerText =
      loja;

  let html = '';

  lista.forEach(item => {

    html += `

      <div
        class="funcionario">

        <div
          class="funcionario-nome">

          ${item.nome}

        </div>

        <div
          class="funcionario-info">

          Escala:
          ${item.escala}

        </div>

        <div
          class="funcionario-info">

          ${item.entrada}
          →
          ${item.saida}

        </div>

        <div
          class="funcionario-info">

          ${item.horas}
          horas

        </div>

      </div>

    `;

  });

  document
    .getElementById(
      'listaPontosLoja'
    )
    .innerHTML =
      html;

  document
    .getElementById(
      'overlayPontosLoja'
    )
    .style.display =
      'block';

}
