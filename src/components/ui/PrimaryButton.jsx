export default function PrimaryButton({

    children,

    ...props

}) {

    return (

        <button

            {...props}

            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"

        >

            {children}

        </button>

    );

}