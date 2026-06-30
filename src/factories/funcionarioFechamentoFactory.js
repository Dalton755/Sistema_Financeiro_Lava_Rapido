export function criarFuncionarioFechamento(

    ponto

) {

    return {

        funcionario_id:

            ponto.funcionario_id,

        nome:

            ponto.funcionarios.nome,

        horas: 0,

        valor_hora:

            Number(

                ponto.funcionarios.valor_hora

            ),

        valor_bruto: 0,

        valor_adiantamentos: 0,

        valor_liquido: 0,

        pontos: [],

        resumo_lojas: [],

        loja_predominante: null,

        adiantamentos: {

            quantidade: 0,

            total: 0,

            registros: []

        },

        status: 'OK',

        alertas: [],

        erros: [],

        podeFechar: true

    }

}