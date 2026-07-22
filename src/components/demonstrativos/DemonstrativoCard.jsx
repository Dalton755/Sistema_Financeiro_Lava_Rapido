export default function DemonstrativoCard({

    demonstrativo,

    onVisualizar

}) {

    function formatarCompetencia(valor) {

        if (!valor) return "-";

        const data = new Date(valor);

        return data.toLocaleDateString(
            "pt-BR",
            {
                month: "short",
                year: "numeric"
            }
        );

    }

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body d-flex flex-column">

                <div className="mb-3">

                    <h4
                        className="fw-bold mb-1 text-truncate"
                        title={demonstrativo.funcionario_nome}
                    >
                        {demonstrativo.funcionario_nome}
                    </h4>

                    <p className="text-muted mb-2">
                        {demonstrativo.loja}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">

                        <small className="text-secondary">

                            <strong>Competência:</strong>{" "}

                            {formatarCompetencia(
                                demonstrativo.fechamento?.competencia
                            )}

                            {" • "}

                            {demonstrativo.fechamento?.quinzena}ª Quinzena

                        </small>

                        <span className="badge bg-primary rounded-pill px-3">

                            GERADO

                        </span>

                    </div>

                </div>

                <div className="mb-3">

                    <div className="mb-2">

                        <strong>CPF:</strong>{" "}
                        {demonstrativo.cpf || "-"}

                    </div>

                    <div>

                        <strong>Cargo:</strong>{" "}
                        {demonstrativo.cargo || "-"}

                    </div>

                    <div className="text-center my-3">

                        <div className="text-muted">

                            Valor Líquido

                        </div>

                        <h4 className="text-success fw-bold mb-0">

                            {new Intl.NumberFormat(

                                "pt-BR",

                                {

                                    style: "currency",

                                    currency: "BRL"

                                }

                            ).format(demonstrativo.valor_liquido)}

                        </h4>

                    </div>

                </div>

                <button

                    className="btn btn-primary mt-auto"

                    onClick={() => onVisualizar(demonstrativo)}

                >

                    <i className="bi bi-eye me-2"></i>

                    Visualizar Demonstrativo

                </button>

            </div>

        </div>

    );

}