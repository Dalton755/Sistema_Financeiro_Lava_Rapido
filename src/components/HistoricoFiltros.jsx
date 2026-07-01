export default function HistoricoFiltros() {

    return (

        <div

            className="card-app mb-4"

        >

            <div className="row g-3">

                <div className="col-md-4">

                    <input

                        className="form-control"

                        placeholder="Pesquisar..."

                    />

                </div>

                <div className="col-md-3">

                    <select

                        className="form-select"

                    >

                        <option>

                            Competência

                        </option>

                    </select>

                </div>

                <div className="col-md-3">

                    <select

                        className="form-select"

                    >

                        <option>

                            Loja

                        </option>

                    </select>

                </div>

                <div className="col-md-2">

                    <select

                        className="form-select"

                    >

                        <option>

                            Status

                        </option>

                    </select>

                </div>

            </div>

        </div>

    )

}