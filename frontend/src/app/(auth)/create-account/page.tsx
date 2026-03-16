import { redirect } from "next/navigation"

/** Create account route — redirects to /account which handles auth UI */
export default function CreateAccountPage() {
    redirect("/account")
}
