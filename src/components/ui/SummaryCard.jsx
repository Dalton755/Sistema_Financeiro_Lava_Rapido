export default function SummaryCard({
    title,
    value,
    icon,
    color = "primary"
}) {

    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                borderRadius: "16px",
                minHeight: "110px"
            }}
        >
            <div className="card-body d-flex align-items-center justify-content-between px-4 py-3">

                <div className="flex-grow-1">

                    <div
                        className="text-secondary mb-2"
                        style={{
                            fontSize: "0.9rem",
                            fontWeight: 500
                        }}
                    >
                        {title}
                    </div>

                    <div
                        className={`fw-bold text-${color}`}
                        style={{
                            fontSize: "1.35rem",
                            lineHeight: "1"
                        }}
                    >
                        {value}
                    </div>

                </div>

                <div
                    className={`bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center ms-3`}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        flexShrink: 0
                    }}
                >
                    <i
                        className={icon}
                        style={{
                            fontSize: "1.8rem"
                        }}
                    />
                </div>

            </div>
        </div>
    );
}