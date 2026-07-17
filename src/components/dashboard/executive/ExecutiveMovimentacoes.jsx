export default function ExecutiveMovimentacoes({

    movimentacoes

}) {

    const ultimas = movimentacoes.slice(0, 5);

    const formatarValor = (valor) =>

        Number(valor).toLocaleString(

            "pt-BR",

            {

                style: "currency",

                currency: "BRL"

            }

        );

    return (

        <div className="card shadow-sm border-0 mt-4">

            <div className="card-body">

                <h5 className="mb-4">

                    📄 Últimas Movimentações

                </h5>

                {

                    ultimas.length === 0

                        ?

                        (

                            <div className="text-center text-muted py-4">

                                Nenhuma movimentação encontrada.

                            </div>

                        )

                        :

                        (

                            ultimas.map(item => (

                                <div

                                    key={item.id}

                                    className="d-flex justify-content-between align-items-center py-3 border-bottom"

                                >

                                    <div>

                                        <div className="fw-semibold">

                                            {item.descricao}

                                        </div>

                                        <small className="text-muted">

                                            {item.categorias?.nome ?? "Sem categoria"}

                                        </small>

                                    </div>

                                    <div className="text-end">

                                        <div

                                            className={

                                                item.tipo === "RECEITA"

                                                    ? "text-success fw-bold"

                                                    : "text-danger fw-bold"

                                            }

                                        >

                                            {formatarValor(item.valor)}

                                        </div>

                                        <small className="text-muted">

                                            {

                                                new Date(

                                                    item.data_movimento

                                                ).toLocaleDateString(

                                                    "pt-BR"

                                                )

                                            }

                                        </small>

                                    </div>

                                </div>

                            ))

                        )

                }

            </div>

        </div>

    );

}