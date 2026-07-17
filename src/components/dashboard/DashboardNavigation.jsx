const ABAS = [
    "Resumo Executivo",
    "Financeiro",
    "Operações",
    "Custos",
    "Equipe",
    "Clientes",
    "Alertas"
];

export default function DashboardNavigation({

    ativa,

    onChange

}) {

    return (

        <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

                <div className="d-flex flex-wrap gap-2">

                    {

                        ABAS.map((aba, index) => (

                            <button

                                key={aba}

                                className={

                                    ativa === index

                                        ? "btn btn-primary"

                                        : "btn btn-outline-primary"

                                }

                                onClick={() => onChange(index)}

                            >

                                {aba}

                            </button>

                        ))

                    }

                </div>

            </div>

        </div>

    );

}