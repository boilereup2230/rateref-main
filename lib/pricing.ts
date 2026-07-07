export const ENGAGEMENT_AVERAGE = 2.5
export const ENGAGEMENT_MULTIPLIER_CAP = 2.5
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

// Map profile content_niche strings to multiplier keys
export const NICHE_KEY_MAP: Record<string, keyof typeof NICHE_MULTIPLIERS> = {
  'Tech & SaaS':          'tech_saas',
  'Business & Finance':   'business_finance',
  'Health & Wellness':    'health_wellness',
  'Sports & Fitness':     'sports_fitness',
  'Nutrition & Food':     'food_beverage',
  'Lifestyle':            'lifestyle',
  'Fashion & Beauty':     'beauty',
  'Entertainment':        'lifestyle',
  'Travel':               'lifestyle',
  'Gaming':               'tech_saas',
  'Education':            'business_finance',
  'Parenting & Family':   'lifestyle',
  'Other':                'lifestyle',
}

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

// Tiered base rate from follower count
export function getTieredBaseCents(followerCount: number): number {
  if (followerCount <= 10_000) {
    return 5_000 + (followerCount / 1_000) * 2_500
  } else if (followerCount <= 50_000) {
    return 20_000 + ((followerCount - 10_000) / 1_000) * 3_000
  } else {
    return 50_000 + ((followerCount - 50_000) / 1_000) * 3_500
  }
}

// Regressive CPM tiers (tax bracket style) — input is avg views PER VIDEO
export function getViewBaseCents(avgViewsPerVideo: number): number {
  if (avgViewsPerVideo <= 0) return 0
  let cents = 0
  // Tier 1: 0 - 10K views @ $15 CPM
  const tier1 = Math.min(avgViewsPerVideo, 10_000)
  cents += (tier1 / 1_000) * 1_500
  // Tier 2: 10K - 100K views @ $8 CPM
  if (avgViewsPerVideo > 10_000) {
    const tier2 = Math.min(avgViewsPerVideo - 10_000, 90_000)
    cents += (tier2 / 1_000) * 800
  }
  // Tier 3: 100K - 1M views @ $2 CPM
  if (avgViewsPerVideo > 100_000) {
    const tier3 = Math.min(avgViewsPerVideo - 100_000, 900_000)
    cents += (tier3 / 1_000) * 200
  }
  // Tier 4: 1M+ views @ $0.20 CPM
  if (avgViewsPerVideo > 1_000_000) {
    const tier4 = avgViewsPerVideo - 1_000_000
    cents += (tier4 / 1_000) * 20
  }
  return Math.round(cents)
}

// Dynamic weighting based on view-to-follower ratio
export function getViewWeight(avgViewsPerVideo: number, followerCount: number): number {
  if (!avgViewsPerVideo || avgViewsPerVideo <= 0) return 0
  const safeFollowers = followerCount > 0 ? followerCount : 1 // division by zero guard
  const R = avgViewsPerVideo / safeFollowers
  if (R <= 1) return 0.30
  if (R < 5)  return 0.70
  return 0.85
}

// Engagement multiplier — capped at 2.5x
export function getEngagementMultiplier(engagementRate: number): number {
  const raw = 1 + ((engagementRate - ENGAGEMENT_AVERAGE) * 0.1)
  return Math.min(Math.max(raw, 0.5), ENGAGEMENT_MULTIPLIER_CAP)
}

export function calculatePrice(
  followerCount:        number,
  engagementRate:       number,
  multiplier:           number,
  manualOverrideCents?: number | null,
  postType?:            string,
  niche?:               NicheKey | null,
  avgViewsPerVideo?:    number | null,
): PriceResult {
  if (manualOverrideCents != null && manualOverrideCents > 0) {
    return {
      priceCents:       manualOverrideCents,
      priceFormatted:   formatCents(manualOverrideCents),
      bonusApplied:     false,
      isManualOverride: true,
    }
  }

  const followerBase    = getTieredBaseCents(followerCount)
  const viewBase        = avgViewsPerVideo ? getViewBaseCents(avgViewsPerVideo) : 0
  const viewWeight      = avgViewsPerVideo ? getViewWeight(avgViewsPerVideo, followerCount) : 0
  const followerWeight  = 1 - viewWeight

  // Blended base rate
  let blendedBase = (followerWeight * followerBase) + (viewWeight * viewBase)

  // Floor: blended rate never below 80% of follower-only when views are present
  if (avgViewsPerVideo && avgViewsPerVideo > 0) {
    blendedBase = Math.max(blendedBase, followerBase * 0.80)
  }

  const engMultiplier   = getEngagementMultiplier(engagementRate)
  const nicheMultiplier = niche ? (NICHE_MULTIPLIERS[niche] ?? 1.0) : 1.0

  const rawCents   = Math.round(blendedBase * engMultiplier * nicheMultiplier * multiplier)
  const floorCents = postType === 'bundle' ? BUNDLE_MINIMUM_PRICE_CENTS : MINIMUM_PRICE_CENTS
  const priceCents = Math.max(rawCents, floorCents)

  return {
    priceCents,
    priceFormatted:   formatCents(priceCents),
    bonusApplied:     engagementRate > ENGAGEMENT_AVERAGE,
    isManualOverride: false,
  }
}

export function buildQuote(
  followerCount:    number,
  engagementRate:   number,
  selectedConfigs:  RateConfig[],
  activeAddons:     Partial<Record<AddonKey, boolean>>,
  niche?:           NicheKey | null,
  avgViewsPerVideo?: number | null,
): QuoteResult {
  const lineItems = selectedConfigs.map(cfg => ({
    label:      cfg.label,
    priceCents: calculatePrice(followerCount, engagementRate, cfg.multiplier, cfg.manual_override_cents, cfg.post_type, niche, avgViewsPerVideo).priceCents,
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
  { post_type: 'reel',    label: 'Instagram Reel',      description: '60-second branded video · 1 revision included', multiplier: 1.00, is_enabled: true, sort_order: 0 },
  { post_type: 'story',   label: 'Instagram Story',     description: '3-frame story set · Link sticker included',      multiplier: 0.25, is_enabled: true, sort_order: 1 },
  { post_type: 'tiktok',  label: 'TikTok Video',        description: '30–60 second TikTok · Trend-aligned format',     multiplier: 0.875, is_enabled: true, sort_order: 2 },
  { post_type: 'static',  label: 'Static Feed Post',    description: 'Single image + caption · 7-day usage rights',    multiplier: 0.55, is_enabled: true, sort_order: 3 },
  { post_type: 'bundle',  label: 'Reel + Story Bundle', description: 'Full Reel plus 3-frame story · Best value',      multiplier: 1.50, is_enabled: true, sort_order: 4 },
  { post_type: 'youtube', label: 'YouTube Video',       description: 'Dedicated video upload to your channel',        multiplier: 1.20, is_enabled: true, sort_order: 5 },
]
