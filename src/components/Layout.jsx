import {

    LayoutDashboard,

    Users,

    Clock3,

    HandCoins,

    ClipboardCheck,

    Wallet

}
    from 'lucide-react'

import { Link } from 'react-router-dom'

import {
    Settings
}
    from 'lucide-react'

export default function Layout({
    children
}) {

    return (

        <>

            <div
                className="d-md-none p-3 bg-white border-bottom d-flex justify-content-between align-items-center"
            >

                <h5 className="m-0">
                    Gestão Financeira
                </h5>

                <button
                    className="btn btn-app"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#menuMobile"
                >

                    ☰

                </button>

            </div>

            <div
                className="d-flex"
            >

                <aside
                    className="sidebar d-none d-md-block"
                >

                    <div className="brand">

                        <div className="brand-logo">
                            LR
                        </div>

                        <div>

                            <strong>
                                Lava Rápido
                            </strong>

                            <div
                                className="brand-subtitle"
                            >
                                Gestão Financeira
                            </div>

                        </div>

                    </div>

                    <Link to="/">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link to="/funcionarios">
                        <Users size={18} />
                        Funcionários
                    </Link>

                    <Link to="/ponto">
                        <Clock3 size={18} />
                        Ponto
                    </Link>

                    <Link to="/adiantamentos">
                        <HandCoins size={18} />
                        Adiantamentos
                    </Link>

                    <Link to="/fechamentos">
                        <ClipboardCheck size={18} />
                        Fechamentos
                    </Link>

                    <Link to="/pagamentos">
                        <Wallet size={18} />
                        Pagamentos
                    </Link>

                    <Link to="/historico-fechamentos">
                        <ClipboardCheck size={18} />
                        Histórico
                    </Link>


                    <Link to="/configuracoes">
                        <Settings size={18} />
                        Configurações
                    </Link>

                </aside>

                <main
                    className="content-app"
                >

                    {children}

                </main>

            </div>

            <div
                className="offcanvas offcanvas-start"
                id="menuMobile"
            >

                <div
                    className="offcanvas-header"
                >

                    <h5>
                        Lava Rápido
                    </h5>

                    <button
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    />

                </div>

                <div
                    className="offcanvas-body"
                >

                    <Link to="/">
                        📊 Dashboard
                    </Link>

                    <Link to="/funcionarios">
                        👥 Funcionários
                    </Link>

                    <Link to="/ponto">
                        ⏰ Ponto
                    </Link>

                    <Link to="/adiantamentos">
                        💰 Adiantamentos
                    </Link>

                    <Link to="/fechamentos">
                        📋 Fechamentos
                    </Link>

                    <Link to="/pagamentos">
                        💵 Pagamentos
                    </Link>

                    <Link to="/historico-fechamentos">
                        📚 Histórico
                    </Link>



                    <Link to="/configuracoes">
                        ⚙️ Configurações
                    </Link>

                </div>

            </div>

        </>

    )

}