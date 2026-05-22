import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    "https://mnrstfenfqvrohcjrwx.supabase.co",
    "sb_publishable_PEimt--Ur3iMRHHX-8tUOw_S5Q0ASST",
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]),
            )
          } catch {}
        },
      },
    },
  )
}
