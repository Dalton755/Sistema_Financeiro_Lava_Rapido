import {

    LayoutDashboard,

    Users,

    Clock3,

    HandCoins,

    ClipboardCheck,

    Wallet,

    Landmark,

    FileText

}
    from 'lucide-react'

import {

    Link,

    useLocation

} from 'react-router-dom'

import {

    useEffect

} from 'react'

import {
    Settings
}
    from 'lucide-react'

export default function Layout({
    children
}) {

    const location = useLocation()

    useEffect(() => {

        const offcanvas = document.getElementById(

            'menuMobile'

        )

        if (!offcanvas) return

        const backdrop = document.querySelector(

            '.offcanvas-backdrop'

        )

        if (backdrop) {

            backdrop.remove()

        }

        document.body.classList.remove(

            'offcanvas-open',

            'modal-open'

        )

        document.body.style.removeProperty(

            'overflow'

        )

        document.body.style.removeProperty(

            'padding-right'

        )

    }, [location])

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

                    <Link to="/demonstrativos">
                        <FileText size={18} />
                        Demonstrativos
                    </Link>

                    <Link to="/financeiro">
                        <Landmark size={18} />
                        Financeiro
                    </Link>

                    <Link to="/historico">
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
                    className="offcanvas-body mobile-menu"
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

                    <Link to="/demonstrativos">
                        📄 Demonstrativos
                    </Link>

                    <Link to="/financeiro">
                        🏦 Financeiro
                    </Link>

                    <Link to="/historico">
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