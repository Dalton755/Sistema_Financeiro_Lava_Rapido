import Card from "../../ui/Card";

export default function PlaceholderCard({

    titulo,

    descricao

}) {

    return (

        <Card>

            <div className="text-center py-5">

                <div
                    style={{
                        fontSize: 48
                    }}
                >

                    🚧

                </div>

                <h4 className="mt-3">

                    {titulo}

                </h4>

                <p className="text-muted">

                    {descricao}

                </p>

            </div>

        </Card>

    );

}