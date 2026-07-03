export const ENGAGEMENT_AVERAGE = 2.5
export const BUNDLE_MINIMUM_PRICE_CENTS = 4_000
export const MINIMUM_PRICE_CENTS = 2_500

export const ADDON_RATES = {
  whitelisting: 0.20,
  exclusivity:  0.30,
  rush:         0.15,
} as const

export const NICHE_MULTIPLIERS = {
  tech_saas:         1.5,
  business_finance:  1.4,
  health_wellness:   1.2,
  sports_fitness:    1.2,
  food_beverage:     1.1,
  lifestyle:         1.0,
  beauty:            0.9,
  fashion:           0.9,
} as const

export type AddonKey = keyof typeof ADDON_RATES
export type NicheKey = keyof typeof NICHE_MULTIPLIERS

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

export function getTieredBaseCents(followerCount: number): number {
  if (followerCount <= 10_000) {
    return 2_000 + (followerCount / 1_000) * 1_500
  } else if (followerCount <= 50_000) {
    return 10_000 + ((followerCount - 10_000) / 1_000) * 2_000
  } else {
    return 25_000 + ((followerCount - 50_000) / 1_000) * 2_500
  }
}

export function getEngagementMultiplier(engagementRate: number): number {
  return 1 + ((engagementRate - ENGAGEMENT_AVERAGE) * 0.1)
}

export function calculatePrice(
  followerCount:       number,
  engagementRate:      number,
  multiplier:          number,
  manualOverrideCents?: number | null,
  postType?:           string,
  niche?:              NicheKey | null,
): PriceResult {
  if (manualOverrideCents != null && manualOverrideCents > 0) {
    return {
      priceCents:       manualOverrideCents,
      priceFormatted:   formatCents(manualOverrideCents),
      bonusApplied:     false,
      isManualOverride: true,
    }
  }
  const baseCents       = getTieredBaseCents(followerCount)
  const engMultiplier   = getEngagementMultiplier(engagementRate)
  const nicheMultiplier = niche ? (NICHE_MULTIPLIERS[niche] ?? 1.0) : 1.0
  const rawCents        = Math.round(baseCents * engMultiplier * nicheMultiplier * multiplier)
  const floorCents      = postType === 'bundle' ? BUNDLE_MINIMUM_PRICE_CENTS : MINIMUM_PRICE_CENTS
  const priceCents      = Math.max(rawCents, floorCents)
  return {
    priceCents,
    priceFormatted:   formatCents(priceCents),
    bonusApplied:     engagementRate > ENGAGEMENT_AVERAGE,
    isManualOverride: false,
  }
}

export function buildQuote(
  followerCount:   number,
  engagementRate:  number,
  selectedConfigs: RateConfig[],
  activeAddons:    Partial<Record<AddonKey, boolean>>,
  niche?:          NicheKey | null,
): QuoteResult {
  const lineItems = selectedConfigs.map(cfg => ({
    label:      cfg.label,
    priceCents: calculatePrice(followerCount, engagementRate, cfg.multiplier, cfg.manual_override_cents, cfg.post_type, niche).priceCents,
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
  { post_type: 'story',  label: 'Instagram Story',     description: '3-frame story set · Link sticker included',      multiplier: 0.25, is_enabled: true, sort_order: 1 },
  { post_type: 'tiktok', label: 'TikTok Video',        description: '30–60 second TikTok · Trend-aligned format',     multiplier: 0.875, is_enabled: true, sort_order: 2 },
  { post_type: 'static', label: 'Static Feed Post',    description: 'Single image + caption · 7-day usage rights',    multiplier: 0.55, is_enabled: true, sort_order: 3 },
  { post_type: 'bundle', label: 'Reel + Story Bundle', description: 'Full Reel plus 3-frame story · Best value',      multiplier: 1.50, is_enabled: true, sort_order: 4 },
]
