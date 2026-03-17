import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const email = "tintinnt05@gmail.com"
    
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        })
        console.log(`Successfully promoted ${email} to ADMIN.`)
        console.log("User details:", user)
    } catch (error) {
        console.error(`Error promoting user: ${error}`)
        console.log("Make sure the user has logged in at least once so they exist in the public.users table.")
    } finally {
        await prisma.$disconnect()
    }
}

main()
