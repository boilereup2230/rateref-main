export const BASE_RATE_PER_10K_CENTS = 10_000
export const ENGAGEMENT_THRESHOLD    = 3.0
export const ENGAGEMENT_BONUS        = 1.5
export const MINIMUM_PRICE_CENTS     = 2_500
export const BUNDLE_MINIMUM_PRICE_CENTS = 4_000

export const ADDON_RATES = {
  whitelisting: 0.20,
  exclusivity:  0.30,
  rush:         0.15,
} as const

export type AddonKey = keyof typeof ADDON_RATES

export interface RateConfig {
  post_type:             string
  label:                 string
  description:           string | null
  multiplier:            number
  manual_override_cents: number | null
  is_enabled:            boolean
  sort_order:            number
}

export interface PriceResult {
  priceCents:       number
  priceFormatted:   string
  bonusApplied:     boolean
  isManualOverride: boolean
}

export interface QuoteResult {
  lineItems:        { label: string; priceCents: number }[]
  addonItems:       { label: string; priceCents: number }[]
  subtotalCents:    number
  addonTotalCents:  number
  totalCents:       number
  totalFormatted:   string
}

export function calculatePrice(
  followerCount:  number,
  engagementRate: number,
  multiplier:     number,
  manualOverrideCents?: number | null,
  postType?: string,
): PriceResult {
  if (manualOverrideCents != null && manualOverrideCents > 0) {
    return {
      priceCents:       manualOverrideCents,
      priceFormatted:   formatCents(manualOverrideCents),
      bonusApplied:     false,
      isManualOverride: true,
    }
  }
  const engBonus   = engagementRate >= ENGAGEMENT_THRESHOLD ? ENGAGEMENT_BONUS : 1.0
  const rawCents   = Math.round((followerCount / 10_000) * BASE_RATE_PER_10K_CENTS * engBonus * multiplier)
  const floorCents = postType === 'bundle' ? BUNDLE_MINIMUM_PRICE_CENTS : MINIMUM_PRICE_CENTS
  const priceCents = Math.max(rawCents, floorCents)
  return {
    priceCents,
    priceFormatted:   formatCents(priceCents),
    bonusApplied:     engagementRate >= ENGAGEMENT_THRESHOLD,
    isManualOverride: false,
  }
}

export function buildQuote(
  followerCount:   number,
  engagementRate:  number,
  selectedConfigs: RateConfig[],
  activeAddons:    Partial<Record<AddonKey, boolean>>,
): QuoteResult {
  const lineItems = selectedConfigs.map(cfg => ({
    label:      cfg.label,
    priceCents: calculatePrice(followerCount, engagementRate, cfg.multiplier, cfg.manual_override_cents, cfg.post_type).priceCents,
  }))
  const subtotalCents   = lineItems.reduce((s, l) => s + l.priceCents, 0)
  const addonItems      = (Object.keys(ADDON_RATES) as AddonKey[])
    .filter(key => activeAddons[key])
    .map(key => ({
      label:      addonLabel(key),
      priceCents: Math.round(subtotalCents * ADDON_RATES[key]),
    }))
  const addonTotalCents = addonItems.reduce((s, a) => s + a.priceCents, 0)
  const totalCents      = subtotalCents + addonTotalCents
  return { lineItems, addonItems, subtotalCents, addonTotalCents, totalCents, totalFormatted: formatCents(totalCents) }
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(cents / 100)
}

function addonLabel(key: AddonKey): string {
  return { whitelisting: 'Whitelisting (30 days) +20%', exclusivity: 'Exclusivity (30 days) +30%', rush: 'Rush fee (<48 hrs) +15%' }[key]
}

export const DEFAULT_RATE_CONFIGS: Omit<RateConfig, 'manual_override_cents'>[] = [
  { post_type: 'reel',   label: 'Instagram Reel',      description: '60-second branded video · 1 revision included', multiplier: 1.00, is_enabled: true, sort_order: 0 },
  { post_type: 'story',  label: 'Instagram Story',     description: '3-frame story set · Link sticker included',      multiplier: 0.45, is_enabled: true, sort_order: 1 },
  { post_type: 'tiktok', label: 'TikTok Video',        description: '30–60 second TikTok · Trend-aligned format',     multiplier: 0.90, is_enabled: true, sort_order: 2 },
  { post_type: 'static', label: 'Static Feed Post',    description: 'Single image + caption · 7-day usage rights',    multiplier: 0.60, is_enabled: true, sort_order: 3 },
  { post_type: 'bundle', label: 'Reel + Story Bundle', description: 'Full Reel plus 3-frame story · Best value',      multiplier: 1.35, is_enabled: true, sort_order: 4 },
]
