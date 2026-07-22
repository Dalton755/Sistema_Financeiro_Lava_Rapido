export default function Card({

    children,

    className = "",

    onClick

}) {

    return (

        <div

            onClick={onClick}

            className={`
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                p-6
                ${className}
            `}

        >

            {children}

        </div>

    );

}