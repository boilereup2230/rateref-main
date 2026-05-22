'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DEFAULT_RATE_CONFIGS } from '@/lib/pricing'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ display_name:'', slug:'', bio:'', instagram_handle:'', tiktok_handle:'', follower_count:'', engagement_rate:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '') : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id, display_name: form.display_name, slug: form.slug,
      bio: form.bio || null, instagram_handle: form.instagram_handle || null,
      tiktok_handle: form.tiktok_handle || null,
      follower_count: parseInt(form.follower_count) || 0,
      engagement_rate: parseFloat(form.engagement_rate) || 0, is_published: true,
    })
    if (profileError) { setError(profileError.message.includes('slug') ? 'That URL is taken — try another.' : profileError.message); setLoading(false); return }
    await supabase.from('rate_configs').insert(DEFAULT_RATE_CONFIGS.map((cfg, i) => ({
      profile_id: user.id, post_type: cfg.post_type, label: cfg.label,
      description: cfg.description, multiplier: cfg.multiplier,
      manual_override_cents: null, is_enabled: cfg.is_enabled, sort_order: i,
    })))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Set up your Rate Card</h1>
          <p className="text-sm text-gray-500 mt-1">Takes 2 minutes. Edit anytime.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Creator name *</label>
              <input name="display_name" required value={form.display_name} onChange={handleChange} placeholder="Sara Chen"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Public URL *</label>
                <span className="text-xs text-emerald-600">rateref.app/c/{form.slug || 'yourname'}</span>
              </div>
              <input name="slug" required value={form.slug} onChange={handleChange} placeholder="saracreates"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Short bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Travel & lifestyle creator" rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Instagram</label>
                <input name="instagram_handle" value={form.instagram_handle} onChange={handleChange} placeholder="@handle"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">TikTok</label>
                <input name="tiktok_handle" value={form.tiktok_handle} onChange={handleChange} placeholder="@handle"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Followers *</label>
                <input name="follower_count" required type="number" min="0" value={form.follower_count} onChange={handleChange} placeholder="46000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Engagement % *</label>
                <input name="engagement_rate" required type="number" min="0" max="100" step="0.1" value={form.engagement_rate} onChange={handleChange} placeholder="4.1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {loading ? 'Creating your rate card…' : 'Create my Rate Card →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
