import { listarContasRepository }
    from "../repositories/contas.js";

export async function listarContas() {

    return await listarContasRepository();

}