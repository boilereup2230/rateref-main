'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/supabase-browser'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [tiktokHandle, setTiktokHandle] = useState('')
  const [youtubeHandle, setYoutubeHandle] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!profileData) { router.push('/setup'); return }
      setProfile(profileData)
      setDisplayName(profileData.display_name ?? '')
      setBio(profileData.bio ?? '')
      setInstagramHandle(profileData.instagram_handle ?? '')
      setTiktokHandle(profileData.tiktok_handle ?? '')
      setYoutubeHandle(profileData.youtube_handle ?? '')
      setAvatarUrl(profileData.avatar_url ?? null)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploading(true)
    setMessage(null)

    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const filePath = `${profile.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setMessage(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', profile.id)

    if (updateError) {
      setMessage(`Saved image but failed to update profile: ${updateError.message}`)
    } else {
      setAvatarUrl(newAvatarUrl)
      setMessage('Profile picture updated!')
    }

    setUploading(false)
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        instagram_handle: instagramHandle,
        tiktok_handle: tiktokHandle,
        youtube_handle: youtubeHandle,
      })
      .eq('id', profile.id)

    if (error) {
      setMessage(`Error saving: ${error.message}`)
    } else {
      setMessage('Settings saved!')
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#6b7280' }}>
      Loading settings...
    </div>
  )

  if (!profile) return null

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <a href="/dashboard" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '14px' }}>
        ← Back to Dashboard
      </a>

      <h1 style={{ fontSize: '24px', marginTop: '16px', marginBottom: '24px' }}>Profile Settings</h1>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          background: message.startsWith('Error') || message.startsWith('Upload failed') ? '#fee2e2' : '#dcfce7',
          color: message.startsWith('Error') || message.startsWith('Upload failed') ? '#991b1b' : '#166534',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {/* Avatar */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Profile Picture</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#e5e7eb',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>No photo</span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              style={{ fontSize: '14px' }}
            />
            {uploading && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Display Name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
        />
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
        />
      </div>

      {/* Socials */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Instagram Handle</label>
        <input
          type="text"
          value={instagramHandle}
          onChange={(e) => setInstagramHandle(e.target.value)}
          placeholder="yourhandle"
          style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>TikTok Handle</label>
        <input
          type="text"
          value={tiktokHandle}
          onChange={(e) => setTiktokHandle(e.target.value)}
          placeholder="yourhandle"
          style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>YouTube Handle</label>
        <input
          type="text"
          value={youtubeHandle}
          onChange={(e) => setYoutubeHandle(e.target.value)}
          placeholder="yourhandle"
          style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: '#16a34a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '14px',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1
        }}
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
