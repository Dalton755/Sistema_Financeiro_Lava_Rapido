import {
    useEffect
}
    from 'preact/hooks'

import {
    gerarPreviaFechamento
}
    from '../services/fechamentos'

export default function TesteFechamento() {

    useEffect(() => {

        testar()

    }, [])

    async function testar() {

        const resultado =

            await gerarPreviaFechamento({

                tipo: 'LOJA',

                lojaId: '14d22132-9d65-468f-a14f-90de0e82a360',

                competencia: '2026-06-01',

                quinzena: 1

            })

        console.log(
            'PERÍODO',
            resultado.inicio,
            resultado.fim
        )

        console.log(
            resultado
        )

        console.log(
            'QUANTIDADE',
            resultado.pontos.length
        )

        console.table(
            resultado.pontos
        )

    }

    return (

        <div>

            Teste Fechamento

        </div>

    )

}