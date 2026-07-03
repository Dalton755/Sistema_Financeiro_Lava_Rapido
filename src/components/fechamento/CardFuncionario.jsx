export default function CardFuncionario({

    funcionario,

    onDetalhes

}) {

    return (

        <div className="card-app mt-4">

            <div className="d-flex justify-content-between align-items-start">

                <div>

                    <h4 className="mb-2">

                        👤 {funcionario.nome}

                    </h4>

                    <small className="text-muted">

                        🏪 Loja predominante

                    </small>

                    <br />

                    <strong>

                        {

                            funcionario.loja_predominante?.nome ||

                            '-'

                        }

                    </strong>

                </div>

                <span className="badge bg-success px-3 py-2">

                    🟢 PRONTO

                </span>

            </div>

            <hr />

            <div className="row text-center">

                <div className="col-6">

                    <small className="text-muted">

                        Dias Trabalhados

                    </small>

                    <h4 className="mt-2">

                        {funcionario.dias_trabalhados}

                    </h4>

                </div>

                <div className="col-6">

                    <small className="text-muted">

                        Escala

                    </small>

                    <h4 className="mt-2">

                        {funcionario.escala}

                    </h4>

                </div>

            </div>

            <div className="row text-center">

                <div className="col">

                    <small className="text-muted">

                        Normais

                    </small>

                    <h4 className="mt-2">

                        {

                            Number(

                                funcionario.horas_normais

                            ).toFixed(2)

                        } h

                    </h4>

                </div>

                <div className="col">

                    <small className="text-muted">

                        Extras

                    </small>

                    <h4 className="mt-2 text-warning">

                        {

                            Number(

                                funcionario.horas_extras

                            ).toFixed(2)

                        } h

                    </h4>

                </div>

                <div className="col">

                    <small className="text-muted">

                        Valor Hora

                    </small>

                    <h4 className="mt-2">

                        R$

                        {

                            Number(

                                funcionario.valor_hora

                            ).toFixed(2)

                        }

                    </h4>

                </div>

            </div>

            <hr />

            <div className="text-center">

                <small className="text-muted">

                    Total de Horas

                </small>

                <h4 className="mt-2">

                    {

                        Number(

                            funcionario.horas

                        ).toFixed(2)

                    } h

                </h4>

            </div>

            <hr />

            <div className="row text-center">

                <div className="col">

                    <small className="text-muted">

                        Bruto

                    </small>

                    <h4 className="mt-2">

                        R$

                        {

                            Number(

                                funcionario.valor_bruto

                            ).toFixed(2)

                        }

                    </h4>

                </div>

                <div className="col">

                    <small className="text-muted">

                        Adiantamentos

                    </small>

                    <h4 className="mt-2 text-danger">

                        R$

                        {

                            Number(

                                funcionario.valor_adiantamentos

                            ).toFixed(2)

                        }

                    </h4>

                </div>

                <div className="col">

                    <small className="text-muted">

                        Líquido

                    </small>

                    <h4 className="mt-2 text-success">

                        R$

                        {

                            Number(

                                funcionario.valor_liquido

                            ).toFixed(2)

                        }

                    </h4>

                </div>

            </div>

            <hr />

            <div className="d-flex justify-content-between">

                <span>

                    🏪 {

                        funcionario.resumo_lojas.length

                    }

                    {

                        funcionario.resumo_lojas.length === 1

                            ? ' Loja'

                            : ' Lojas'

                    }

                </span>

                <span>

                    💵 {

                        funcionario.adiantamentos.quantidade

                    }

                    {

                        funcionario.adiantamentos.quantidade === 1

                            ? ' Adiantamento'

                            : ' Adiantamentos'

                    }

                </span>

            </div>

            <button

                className="btn btn-outline-primary w-100 mt-4"

                onClick={() =>

                    onDetalhes(

                        funcionario

                    )

                }

            >

                🔍 Ver Detalhes

            </button>

        </div>

    )

}