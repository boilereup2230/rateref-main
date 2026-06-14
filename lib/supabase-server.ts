import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    "https://vgquclxeehmqqxqcpvie.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncXVjbHhlZWhtcXF4cWNwdmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzA3NzUsImV4cCI6MjA5NTA0Njc3NX0.j9RosPQGfbbM1fizQArx8Qv7y2VUBVZsoxYTn_BRmBk",
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
