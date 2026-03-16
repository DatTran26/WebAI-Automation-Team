"use client"

import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

/**
 * Client-side trigger that calls an API to sync user with DB.
 */
async function syncUserWithDb(authUser: SupabaseUser) {
    try {
        await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                supabaseId: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name
            })
        })
    } catch (error) {
        console.error("Sync error:", error)
    }
}

/**
 * Global component to ensure logged-in user is synced to the database.
 */
export function UserSync() {
    const supabase = createClient()

    useEffect(() => {
        // Check initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) syncUserWithDb(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
                syncUserWithDb(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    return null
}
