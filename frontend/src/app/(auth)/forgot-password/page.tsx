import { redirect } from "next/navigation"

/** Forgot password route — redirects to /account which handles auth UI */
export default function ForgotPasswordPage() {
    redirect("/account")
}
