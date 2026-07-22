import { useEffect, useState } from "react";

import RecebimentoCard
    from "../components/recebimentos/RecebimentoCard";

import { listarRecebimentos }
    from "../services/recebimentos";

import {
    importarPagamentos
}
    from "../services/importacaoPagamentos";

import { toast }
    from "react-toastify";

import PageContainer
    from "../components/ui/PageContainer";

import PageHeader
    from "../components/ui/PageHeader";

import SummaryCard
    from "../components/ui/SummaryCard";

import EmptyState
    from "../components/ui/EmptyState";

import {
    formatarMoeda
} from "../lib/formatadores";

import Layout from "../components/Layout";

export default function Recebimentos() {

    const [

        recebimentos,

        setRecebimentos

    ] = useState([]);

    const [

        importando,

        setImportando

    ] = useState(false);


    useEffect(() => {

        carregar();

    }, []);

    async function carregar() {

        try {

            const dados =
                await listarRecebimentos();

            console.log("================================");
            console.log("RECEBIMENTOS");
            console.log("================================");
            console.log(dados);

            setRecebimentos(dados);

        } catch (error) {

            console.error(error);

        }

    }

    async function importar() {

        try {

            setImportando(true);

            toast.info("Importando pagamentos...");

            const resultado =
                await importarPagamentos();

            if (!resultado.sucesso) {

                toast.error(

                    resultado.erro ||

                    "Erro na importação."

                );

                return;

            }

            toast.success(

                `Importação concluída. ${resultado.quantidade ?? 0} pagamento(s) importado(s).`

            );

            await carregar();

        }

        catch (erro) {

            console.error(erro);

            toast.error(

                "Falha ao importar pagamentos."

            );

        }

        finally {

            setImportando(false);

        }

    }

    const quantidadeRecebimentos =
        recebimentos.length;

    const quantidadeNotas =
        recebimentos.reduce(

            (total, item) =>

                total + item.quantidadeNotas,

            0

        );

    const valorTotal =
        recebimentos.reduce(

            (total, item) =>

                total + item.valorTotal,

            0

        );

    return (

        <Layout>

            <PageContainer>

                <PageHeader

                    title="Recebimentos"

                    subtitle="Confirme os pagamentos importados automaticamente."

                />

                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-body d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="mb-1">

                                Importação de Pagamentos

                            </h5>

                            <small className="text-muted">

                                Busque novos pagamentos enviados pela Localiza.

                            </small>

                        </div>

                        <button

                            className="btn btn-primary btn-lg"

                            onClick={importar}

                            disabled={importando}

                        >

                            {

                                importando

                                    ?

                                    <>

                                        <span

                                            className="spinner-border spinner-border-sm me-2"

                                            role="status"

                                        />

                                        Importando...

                                    </>

                                    :

                                    <>

                                        <i className="bi bi-arrow-repeat me-2"></i>

                                        Importar Pagamentos

                                    </>

                            }

                        </button>

                    </div>

                </div>

                <div className="row g-3 mb-4">

                    <div className="col-md-4">

                        <SummaryCard
                            title="Pendentes"
                            value={quantidadeRecebimentos}
                            icon="bi bi-hourglass-split"
                            color="warning"
                        />

                    </div>

                    <div className="col-md-4">

                        <SummaryCard
                            title="Notas"
                            value={quantidadeNotas}
                            icon="bi bi-receipt"
                            color="primary"
                        />

                    </div>

                    <div className="col-md-4">

                        <SummaryCard
                            title="Valor Pendente"
                            value={formatarMoeda(valorTotal)}
                            icon="bi bi-cash-stack"
                            color="success"
                        />

                    </div>

                </div>

                {

                    recebimentos.length === 0

                        ?

                        (

                            <EmptyState

                                title="Nenhum recebimento pendente"

                                description="Todos os pagamentos importados já foram confirmados."

                            />

                        )

                        :

                        (

                            recebimentos.map(recebimento => (

                                <RecebimentoCard
                                    key={recebimento.messageId}
                                    recebimento={recebimento}
                                    onConfirmado={() => {

                                        setRecebimentos(atual =>

                                            atual.filter(

                                                item =>

                                                    item.messageId !== recebimento.messageId

                                            )

                                        );

                                    }}
                                />

                            ))

                        )

                }

            </PageContainer>

        </Layout>

    );

}