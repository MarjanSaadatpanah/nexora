import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <SignIn
                routing="path"
                path="/sign-in"
                appearance={{
                    elements: {
                        card: "shadow-2xl rounded-2xl border border-gray-200 p-6",
                        headerTitle: "text-2xl font-bold text-blue-600",
                        formFieldInput: "rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500",
                        footerActionLink: "text-blue-600 hover:underline"
                    }
                }}
            />
        </div>
    )
}

export default SignInPage
