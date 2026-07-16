export default function EmptyState({

    title,

    description

}) {

    return (

        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">

            <h2 className="text-xl font-semibold">

                {title}

            </h2>

            <p className="mt-2 text-gray-500">

                {description}

            </p>

        </div>

    );

}