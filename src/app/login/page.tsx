import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from '@/app/ui/button';
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Finance Company Invoice Tracker",
        default: "Login",
    },
}

export default function LoginPage() {
    return (
        <main className={`${inter.className} antialiased bg-login-img h-dvh flex flex-col justify-center items-center text-2xl text-nowrap text-center sm:text-4xl tracking-tight p-4`}>
            <div className="bg-white flex flex-col items-center border-2 gap-4 sm:gap-8 p-7 sm:p-16 border-gray-100 shadow-xl">
                <h1>Welcome to <span className="font-medium">Acme Corp</span></h1>
                <Button>
                    <LoginLink>Sign in</LoginLink>
                </Button>
            </div>
        </main>

    )
}
