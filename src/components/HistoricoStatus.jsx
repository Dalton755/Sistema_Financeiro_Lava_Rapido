export default function HistoricoStatus({

    status

}) {

    const cores = {

        Aberto: 'warning',

        Parcial: 'info',

        Pago: 'success'

    }

    return (

        <span

            className={`badge bg-${

                cores[status] ||

                'secondary'

            } px-3 py-2 rounded-pill`}

        >

            {status}

        </span>

    )

}