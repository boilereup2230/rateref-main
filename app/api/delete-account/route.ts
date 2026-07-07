import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: userError } = await anonClient.auth.getUser(token)
    if (userError || !user) {
      console.error('DELETE-ACCOUNT AUTH DEBUG:', {
        userError,
        tokenPrefix: token.slice(0, 20),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      })
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const userId = user.id

    const { data: avatarFiles } = await admin.storage.from('avatars').list(userId)
    if (avatarFiles && avatarFiles.length > 0) {
      await admin.storage.from('avatars').remove(avatarFiles.map(f => `${userId}/${f.name}`))
    }
    const { data: headerFiles } = await admin.storage.from('headers').list(userId)
    if (headerFiles && headerFiles.length > 0) {
      await admin.storage.from('headers').remove(headerFiles.map(f => `${userId}/${f.name}`))
    }

    await admin.from('inquiries').delete().eq('profile_id', userId)
    await admin.from('rate_configs').delete().eq('profile_id', userId)
    await admin.from('profiles').delete().eq('id', userId)

    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId)
    if (deleteAuthError) {
      return NextResponse.json({ error: 'Account data deleted, but login removal failed. Contact support.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
