import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from '@/app/ui/button';
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Finance Company Invoice Tracker",
        default: "Login",
    },
}

export default function LoginPage() {
    return (
        <main className={`${lusitana.className} antialiased bg-login-img h-dvh m-auto flex flex-col justify-center items-center gap-6 text-3xl sm:text-4xl p-4`}>
            <div className="bg-white flex flex-col items-center border-2 gap-5 m-2 p-8 sm:p-16 border-gray-100 shadow-lg">
                <h1>Welcome to Acme Corp</h1>
                <Button type="submit" className="font-serif">
                    <LoginLink>Sign in</LoginLink>
                </Button>
            </div>
        </main>

    )
}
