'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function AgencySignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [agencyCode, setAgencyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function generateCode(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError(authError?.message || 'Signup failed.')
      setLoading(false)
      return
    }

    const { error: agencyError } = await supabase.from('agencies').insert({
      display_name: agencyName,
      email,
      agency_code:  agencyCode,
      owner_id:     authData.user.id,
    })

    if (agencyError) {
      setError(agencyError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">RateRef</h1>
          <p className="text-sm text-gray-500 mt-1">Agency dashboard access</p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-base font-medium text-gray-900 mb-2">Agency created</h2>
            <p className="text-sm text-gray-500 mb-4">Your agency link tag is:</p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm text-emerald-700 font-semibold mb-4">
              ?via={agencyCode}
            </div>
            <p className="text-xs text-gray-400 mb-6">Append this to any creator's RateRef link when sharing with brands. Inquiries will appear in your agency dashboard.</p>
            <a href="/agency/dashboard"
              className="block w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 text-center">
              Go to dashboard →
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-base font-medium text-gray-900 mb-6">Create your agency account</h2>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Agency name</label>
                <input type="text" required value={agencyName}
                  onChange={e => {
                    setAgencyName(e.target.value)
                    setAgencyCode(generateCode(e.target.value))
                  }}
                  placeholder="Kaleo Sports & Entertainment"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Your link tag</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">?via=</span>
                  <input type="text" required value={agencyCode}
                    onChange={e => setAgencyCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    placeholder="kse"
                    className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" />
                </div>
                <p className="text-xs text-gray-400 mt-1">This gets appended to creator links you share with brands.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {loading ? 'Creating account…' : 'Create agency account'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <a href="/login" className="text-sm text-emerald-600 hover:underline">Already have an account? Sign in</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
