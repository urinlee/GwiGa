

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Login Page</h1>
      <p className="text-lg text-gray-600 mb-8">Please sign in to continue.</p>
      <button
        onClick={() => (window.location.href = "/api/auth/signin")}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Sign in with Google
      </button>
    </div>
  );
}