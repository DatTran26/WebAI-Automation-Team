import { redirect } from "next/navigation"

/** Login route — redirects to /account which handles auth UI */
export default function LoginPage() {
    redirect("/account")
}
