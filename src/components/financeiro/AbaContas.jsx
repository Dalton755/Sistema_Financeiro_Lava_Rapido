import { useEffect, useState } from "react";
import {
    listarContas,
    salvarConta
} from "../../services/contas";

import { toast } from "react-toastify";

export default function AbaContas() {

    const [contas, setContas] = useState([]);

    async function carregar() {

        try {

            const dados = await listarContas();

            setContas(dados);

        } catch (error) {

            toast.error("Erro ao carregar contas.");

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    return (

        <div className="card-app p-4">

            <h5>Contas Financeiras</h5>

            <hr />

            <p>Total de contas: {contas.length}</p>

        </div>

    );

}