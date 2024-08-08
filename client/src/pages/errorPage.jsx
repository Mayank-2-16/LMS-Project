import React from 'react'

const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
                <h1 className="text-9xl font-bold">404</h1>
                <p className="text-2xl mt-4">Page Not Found</p>
                <p className="mt-2">The page you are looking for does not exist.</p>
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition duration-300"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}

export default ErrorPage
