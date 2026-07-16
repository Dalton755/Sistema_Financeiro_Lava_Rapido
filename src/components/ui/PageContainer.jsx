export default function PageContainer({ children }) {

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto p-8">

                {children}

            </div>

        </div>

    );

}