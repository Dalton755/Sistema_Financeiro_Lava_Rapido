export default function ExecutiveAlertas({

    alertas

}) {

    return (

        <div className="card shadow-sm border-0 mt-4">

            <div className="card-body">

                <h5 className="mb-4">

                    🚨 Alertas

                </h5>

                {

                    alertas.length === 0

                        ?

                        (

                            <div className="text-center text-muted py-4">

                                Nenhum alerta encontrado.

                            </div>

                        )

                        :

                        (

                            alertas.map((alerta, index) => (

                                <div

                                    key={index}

                                    className="d-flex align-items-center border-bottom py-3"

                                >

                                    <div className="me-3">

                                        {

                                            alerta.tipo === "danger"

                                                ?

                                                <i className="bi bi-exclamation-circle-fill text-danger fs-5"></i>

                                                :

                                                <i className="bi bi-check-circle-fill text-success fs-5"></i>

                                        }

                                    </div>

                                    <div>

                                        {alerta.mensagem}

                                    </div>

                                </div>

                            ))

                        )

                }

            </div>

        </div>

    );

}