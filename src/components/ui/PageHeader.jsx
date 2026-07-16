export default function PageHeader({

    title,

    subtitle

}) {

    return (

        <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900">

                {title}

            </h1>

            {subtitle && (

                <p className="mt-2 text-gray-500">

                    {subtitle}

                </p>

            )}

        </div>

    );

}