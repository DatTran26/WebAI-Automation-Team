import { redirect } from "next/navigation"

/** Verify email route — redirects to /account which handles auth UI */
export default function VerifyEmailPage() {
    redirect("/account")
}
