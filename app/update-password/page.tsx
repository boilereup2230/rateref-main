'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  async function handleSubmit() {
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '24px 16px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        width: '100%',
        maxWidth: 400,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}>
              Rate<span style={{ color: '#4ade80' }}>Ref</span>
            </span>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: 16,
          padding: '32px 28px',
        }}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#0d1f14',
                border: '1px solid #1a3a22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 22,
              }}>✓</div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                Password updated
              </h1>
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
                You're all set. Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <>
              <h1 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}>
                Set a new password
              </h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
                Choose a strong password for your RateRef account.
              </p>

              {/* New password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#ccc',
                  marginBottom: 6,
                }}>
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#0a0a0a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#ccc',
                  marginBottom: 6,
                }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#0a0a0a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: '#1f0a0a',
                  border: '1px solid #3a1a1a',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 20,
                  fontSize: 13,
                  color: '#f87171',
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: loading ? '#1a1a1a' : '#4ade80',
                  color: loading ? '#666' : '#0a0a0a',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#444', marginTop: 20 }}>
          <a href="/login" style={{ color: '#666', textDecoration: 'none' }}>← Back to sign in</a>
        </p>

      </div>
    </div>
  )
}
