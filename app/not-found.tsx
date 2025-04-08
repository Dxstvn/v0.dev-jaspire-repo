// Create a not-found page that doesn't depend on Firebase

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        Go Home
      </a>
    </div>
  )
}
