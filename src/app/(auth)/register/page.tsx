


//로그인 구현

export default async function Register() {

    
    
    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">회원가입</h1>
        <p className="text-lg text-gray-600 mb-8">계속하려면 회원가입하세요.</p>
        <div className="w-180">
        <form className="flex flex-col gap-4" >
            <input
            type="text"
            placeholder="이름"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 border text-black hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >회원가입</button>
        </form>
        </div>
    </div>
    );
}