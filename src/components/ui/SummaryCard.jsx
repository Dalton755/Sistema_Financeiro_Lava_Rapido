export default function SummaryCard({

    title,

    value,

    icon,

    color = "primary"

}) {

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body py-2 px-3">

                <div className="d-flex align-items-center justify-content-between">

                    <div>

                        <div
                            className="text-secondary"
                            style={{
                                fontSize: "12px",
                                fontWeight: 500
                            }}
                        >
                            {title}
                        </div>

                        <div
                            className={`fw-bold text-${color}`}
                            style={{
                                fontSize: "1.35rem",
                                lineHeight: "1.2"
                            }}
                        >
                            {value}
                        </div>

                    </div>

                    <div
                        className={`text-${color}`}
                        style={{
                            fontSize: "1.8rem"
                        }}
                    >
                        <i className={icon}></i>
                    </div>

                </div>

            </div>

        </div>

    );

}