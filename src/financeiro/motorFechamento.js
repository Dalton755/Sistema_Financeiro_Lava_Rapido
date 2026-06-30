import {

    buscarPontosFechamento

}

from '../services/fechamentos'

export async function gerarPreviaFechamento(

    filtro

){

    const pontos =

        await buscarPontosFechamento(

            filtro

        )



    // As próximas etapas serão
    // implementadas aqui.

    return pontos

}