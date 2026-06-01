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

  const data =
    document
      .getElementById('data')
      .value;

  const resultado =
    await apiGet({

      acao:
        'funcionarios-data',

      data

    });

  renderizar(resultado);

}
