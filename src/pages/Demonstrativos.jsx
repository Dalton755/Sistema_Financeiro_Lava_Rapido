import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Demonstrativos() {

    const [demonstrativos, setDemonstrativos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [loading, setLoading] = useState(true);

    async function carregarDemonstrativos() {

        setLoading(true);

        const { data, error } = await supabase
            .schema("financeiro")
            .from("vw_demonstrativos")
            .select("*")
            .order("data_fechamento", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setDemonstrativos(data || []);
        }

        setLoading(false);
    }

    useEffect(() => {
        carregarDemonstrativos();
    }, []);

    const lista = useMemo(() => {

        return demonstrativos.filter(item =>
            item.nome.toLowerCase().includes(pesquisa.toLowerCase())
        );

    }, [pesquisa, demonstrativos]);

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Demonstrativos
                </h1>

                <p className="text-gray-500">
                    Consulte os demonstrativos de pagamento.
                </p>

            </div>

            <input

                type="text"

                placeholder="Pesquisar funcionário..."

                value={pesquisa}

                onChange={(e) => setPesquisa(e.target.value)}

                className="w-full rounded-xl border px-4 py-3"

            />

            {loading && (
                <p>Carregando...</p>
            )}

            {!loading && lista.map(item => (

                <div

                    key={item.id}

                    className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md cursor-pointer transition"

                >

                    <div className="flex justify-between">

                        <div>

                            <h2 className="font-semibold text-lg">
                                {item.nome}
                            </h2>

                            <p className="text-gray-500">
                                {item.cargo}
                            </p>

                        </div>

                        <span className="font-bold text-green-600">
                            R$ {Number(item.valor_liquido).toFixed(2)}
                        </span>

                    </div>

                    <div className="mt-3 text-sm text-gray-500">

                        <p>{item.competencia}</p>

                        <p>Status: {item.status}</p>

                    </div>

                </div>

            ))}

        </div>

    );

}