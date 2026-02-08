import { useRef, useCallback, useState, useEffect } from 'react'
import { PersonalityCard } from './PersonalityCard'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './ShareCard.css'

// Card dimensions for trading card (portrait orientation)
const CARD_WIDTH = 800
const CARD_HEIGHT = 1120

// Colors from design system
const COLORS = {
  bgDeep: '#0a0a0e',
  bgSurface: '#12121a',
  stone: '#2e2e3e',
  stoneLlight: '#4a4a5e',
  textPrimary: '#e8e4df',
  textSecondary: '#8a8a9a',
  textMuted: '#5a5a6a',
  accent: '#c9a96e',
  accentDim: '#7a6540',
}

function drawLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: CanvasTextAlign = 'left'
) {
  if (!text) return

  if (spacing <= 0) {
    ctx.textAlign = align
    ctx.fillText(text, x, y)
    return
  }

  const chars = text.split('')
  const totalWidth = chars.reduce((acc, ch, i) => {
    const w = ctx.measureText(ch).width
    return acc + w + (i < chars.length - 1 ? spacing : 0)
  }, 0)

  let cursorX = x
  if (align === 'center') cursorX = x - totalWidth / 2
  if (align === 'right') cursorX = x - totalWidth

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    ctx.fillText(ch, cursorX, y)
    cursorX += ctx.measureText(ch).width + spacing
  }
}

// Wait for document fonts to be ready (Cinzel/Inter loaded via CSS)
async function loadFont(): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const maybeRoundRect = (ctx as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect
  if (typeof maybeRoundRect === 'function') {
    ctx.beginPath()
    ;(ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void })
      .roundRect(x, y, width, height, radius)
    return
  }

  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
}

interface ShareCardProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function ShareCard({ profile, stats }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsGenerating(true)

    try {
      // Ensure fonts are ready
      await loadFont()
      const portrait = await loadImage(profile.image)

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // ===== TRADING CARD DESIGN =====

      // Background - deep dark
      ctx.fillStyle = COLORS.bgDeep
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

      // Outer border (gold frame)
      const borderWidth = 20
      ctx.fillStyle = COLORS.accent
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

      // Inner dark background
      ctx.fillStyle = COLORS.bgDeep
      ctx.fillRect(borderWidth, borderWidth, CARD_WIDTH - borderWidth * 2, CARD_HEIGHT - borderWidth * 2)

      // Holographic gradient overlay effect
      const holoGradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
      holoGradient.addColorStop(0, 'rgba(201, 169, 110, 0.15)')
      holoGradient.addColorStop(0.25, 'rgba(150, 100, 200, 0.1)')
      holoGradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.1)')
      holoGradient.addColorStop(0.75, 'rgba(255, 100, 150, 0.1)')
      holoGradient.addColorStop(1, 'rgba(201, 169, 110, 0.15)')
      ctx.fillStyle = holoGradient
      ctx.fillRect(borderWidth, borderWidth, CARD_WIDTH - borderWidth * 2, CARD_HEIGHT - borderWidth * 2)

      // Corner decorations
      const cornerSize = 40
      const cornerOffset = borderWidth + 10
      ctx.fillStyle = COLORS.accent
      // Top-left corner
      ctx.beginPath()
      ctx.moveTo(cornerOffset, cornerOffset)
      ctx.lineTo(cornerOffset + cornerSize, cornerOffset)
      ctx.lineTo(cornerOffset, cornerOffset + cornerSize)
      ctx.closePath()
      ctx.fill()
      // Top-right corner
      ctx.beginPath()
      ctx.moveTo(CARD_WIDTH - cornerOffset, cornerOffset)
      ctx.lineTo(CARD_WIDTH - cornerOffset - cornerSize, cornerOffset)
      ctx.lineTo(CARD_WIDTH - cornerOffset, cornerOffset + cornerSize)
      ctx.closePath()
      ctx.fill()
      // Bottom-left corner
      ctx.beginPath()
      ctx.moveTo(cornerOffset, CARD_HEIGHT - cornerOffset)
      ctx.lineTo(cornerOffset + cornerSize, CARD_HEIGHT - cornerOffset)
      ctx.lineTo(cornerOffset, CARD_HEIGHT - cornerOffset - cornerSize)
      ctx.closePath()
      ctx.fill()
      // Bottom-right corner
      ctx.beginPath()
      ctx.moveTo(CARD_WIDTH - cornerOffset, CARD_HEIGHT - cornerOffset)
      ctx.lineTo(CARD_WIDTH - cornerOffset - cornerSize, CARD_HEIGHT - cornerOffset)
      ctx.lineTo(CARD_WIDTH - cornerOffset, CARD_HEIGHT - cornerOffset - cornerSize)
      ctx.closePath()
      ctx.fill()

      // Rarity indicator (based on total tabs)
      let rarity = 'COMMON'
      if (stats.totalTabs > 1000) rarity = 'LEGENDARY'
      else if (stats.totalTabs > 500) rarity = 'EPIC'
      else if (stats.totalTabs > 100) rarity = 'RARE'
      else if (stats.totalTabs > 50) rarity = 'UNCOMMON'

      ctx.fillStyle = COLORS.accent
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(rarity, CARD_WIDTH / 2, borderWidth + 25)

      // Portrait frame and image
      const portraitBox = 340
      const portraitX = (CARD_WIDTH - portraitBox) / 2
      const portraitY = 90

      // Portrait border
      ctx.fillStyle = COLORS.accent
      drawRoundedRect(ctx, portraitX - 8, portraitY - 8, portraitBox + 16, portraitBox + 16, 8)
      ctx.fill()

      // Portrait background
      ctx.fillStyle = COLORS.bgSurface
      drawRoundedRect(ctx, portraitX, portraitY, portraitBox, portraitBox, 6)
      ctx.fill()

      // Portrait image (preserve aspect ratio)
      const scale = Math.min(portraitBox / portrait.width, portraitBox / portrait.height)
      const drawW = portrait.width * scale
      const drawH = portrait.height * scale
      ctx.save()
      drawRoundedRect(ctx, portraitX, portraitY, portraitBox, portraitBox, 6)
      ctx.clip()
      ctx.drawImage(
        portrait,
        portraitX + (portraitBox - drawW) / 2,
        portraitY + (portraitBox - drawH) / 2,
        drawW,
        drawH
      )
      ctx.restore()

      // Title
      const titleText = profile.title.toUpperCase()
      ctx.fillStyle = COLORS.accent
      ctx.font = 'bold 36px Cinzel, serif'
      ctx.textAlign = 'center'
      const titleLines = wrapText(ctx, titleText, CARD_WIDTH * 0.85)
      const titleStartY = portraitY + portraitBox + 50
      titleLines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, CARD_WIDTH / 2, titleStartY + index * 42)
      })

      // Description
      ctx.fillStyle = COLORS.textSecondary
      ctx.font = '16px Inter, sans-serif'
      const descLines = wrapText(ctx, profile.description, CARD_WIDTH * 0.85)
      const descStartY = titleStartY + (titleLines.length * 42) + 20
      descLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, CARD_WIDTH / 2, descStartY + index * 24)
      })

      // Stats section background
      const statsBoxY = descStartY + 90
      const statsBoxHeight = CARD_HEIGHT - statsBoxY - borderWidth - 20
      ctx.fillStyle = 'rgba(18, 18, 26, 0.8)'
      drawRoundedRect(ctx, borderWidth + 30, statsBoxY, CARD_WIDTH - borderWidth * 2 - 60, statsBoxHeight, 8)
      ctx.fill()

      // Stats grid
      const statsData = [
        { value: stats.totalTabs.toString(), label: 'TABS EXHUMED' },
        { value: stats.uniqueDomains.toString(), label: 'UNIQUE DOMAINS' },
        { value: stats.repeatDomains.toString(), label: 'REPEAT DOMAINS' },
        { value: stats.unresolvedSearches.toString(), label: 'UNFINISHED SEARCHES' },
        { value: stats.mappedLocations.toString(), label: 'LOCATIONS MAPPED' },
        { value: stats.topDomain?.domain ?? 'N/A', label: 'TOP DOMAIN', small: true },
      ]

      const statsPadding = 60
      const statsStartY = statsBoxY + 30
      const statRowHeight = 60

      statsData.forEach((stat, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = borderWidth + statsPadding + col * (CARD_WIDTH - borderWidth * 2 - statsPadding * 2) / 2
        const y = statsStartY + row * statRowHeight

        ctx.fillStyle = COLORS.accent
        ctx.font = stat.small ? 'bold 16px Cinzel, serif' : 'bold 22px Cinzel, serif'
        ctx.textAlign = col === 0 ? 'left' : 'right'
        ctx.fillText(stat.value, x, y)

        ctx.fillStyle = COLORS.textMuted
        ctx.font = '11px Inter, sans-serif'
        drawLetterSpacedText(ctx, stat.label, x, y + 20, 1.5, col === 0 ? 'left' : 'right')
      })

      // Top categories at bottom
      if (stats.topCategories.length > 0) {
        const categoriesY = CARD_HEIGHT - borderWidth - 40
        ctx.fillStyle = COLORS.textMuted
        ctx.font = '11px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('TOP CATEGORIES:', CARD_WIDTH / 2, categoriesY - 20)

        const categoryText = stats.topCategories.slice(0, 3).map(c => c.label).join(' • ')
        ctx.fillStyle = COLORS.textSecondary
        ctx.font = 'bold 13px Inter, sans-serif'
        ctx.fillText(categoryText, CARD_WIDTH / 2, categoriesY)
      }

      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating share card:', error)
      setIsGenerated(false)
    } finally {
      setIsGenerating(false)
    }
  }, [profile, stats])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'exhume-link-results.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleCopyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => {
          if (b) resolve(b)
          else reject(new Error('Failed to create blob'))
        }, 'image/png')
      })

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback: download instead
      handleDownload()
    }
  }, [handleDownload])

  const handleCopyShareLink = useCallback(async () => {
    try {
      const payload = {
        title: profile.title,
        description: profile.description,
        image: profile.image,
        stats: {
          totalTabs: stats.totalTabs,
          uniqueDomains: stats.uniqueDomains,
          topDomain: stats.topDomain,
        },
      }

      const json = JSON.stringify(payload)
      const base64 = btoa(unescape(encodeURIComponent(json)))
      const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${base64Url}`

      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy share link:', error)
    }
  }, [profile, stats])

  const getShareUrl = useCallback(() => {
    const payload = {
      title: profile.title,
      description: profile.description,
      image: profile.image,
      stats: {
        totalTabs: stats.totalTabs,
        uniqueDomains: stats.uniqueDomains,
        topDomain: stats.topDomain,
      },
    }

    const json = JSON.stringify(payload)
    const base64 = btoa(unescape(encodeURIComponent(json)))
    const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
    return `${window.location.origin}${window.location.pathname}?share=${base64Url}`
  }, [profile, stats])

  const handleShareToTwitter = useCallback(() => {
    const shareUrl = getShareUrl()
    const text = `I'm a ${profile.title}! I've exhumed ${stats.totalTabs} tabs across ${stats.uniqueDomains} domains. What's your digital afterlife profile?`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=ExhumeLink,DigitalArchaeology`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }, [getShareUrl, profile.title, stats.totalTabs, stats.uniqueDomains])

  const handleShareToFacebook = useCallback(() => {
    const shareUrl = getShareUrl()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }, [getShareUrl])

  const handleShareToLinkedIn = useCallback(() => {
    const shareUrl = getShareUrl()
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedInUrl, '_blank', 'width=550,height=420')
  }, [getShareUrl])

  const handleShareToReddit = useCallback(() => {
    const shareUrl = getShareUrl()
    const title = `I'm a ${profile.title}! Check out my digital archaeology profile`
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`
    window.open(redditUrl, '_blank', 'width=550,height=420')
  }, [getShareUrl, profile.title])

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) {
      return
    }

    try {
      const shareUrl = getShareUrl()
      await navigator.share({
        title: `I'm a ${profile.title}!`,
        text: `I've exhumed ${stats.totalTabs} tabs across ${stats.uniqueDomains} domains. What's your digital afterlife profile?`,
        url: shareUrl,
      })
    } catch (error) {
      // User cancelled or error occurred
      console.log('Native share cancelled or failed:', error)
    }
  }, [getShareUrl, profile.title, stats.totalTabs, stats.uniqueDomains])

  useEffect(() => {
    function handleShareRequest() {
      setShowShareModal(true)
    }

    window.addEventListener('share-card-request', handleShareRequest)
    return () => window.removeEventListener('share-card-request', handleShareRequest)
  }, [])

  useEffect(() => {
    if (showShareModal && !isGenerated && !isGenerating) {
      generateCard()
    }
  }, [showShareModal, isGenerated, isGenerating, generateCard])

  return (
    <>
      <PersonalityCard profile={profile} />

      {showShareModal && (
        <div className="share-card-modal" onClick={() => setShowShareModal(false)}>
          <div className="share-card-modal__content" onClick={e => e.stopPropagation()}>
            <div className="share-card-modal__header">
              <span className="share-card-modal__eyebrow">Share</span>
              <button
                className="share-card-close"
                onClick={() => setShowShareModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="share-card-modal__title">Choose your ritual.</p>

            <div className="share-card-section">
              <p className="share-card-section__title">Download & Copy</p>
              <div className="share-card-actions">
                <button
                  className="share-card-button share-card-button--download"
                  onClick={handleDownload}
                >
                  📥 Download Card
                </button>
                <button
                  className="share-card-button share-card-button--copy"
                  onClick={handleCopyToClipboard}
                >
                  {copySuccess ? '✓ Copied!' : '📋 Copy Image'}
                </button>
                <button
                  className="share-card-button share-card-button--link"
                  onClick={handleCopyShareLink}
                >
                  {linkCopied ? '✓ Link Copied!' : '🔗 Copy Link'}
                </button>
              </div>
            </div>

            <div className="share-card-section">
              <p className="share-card-section__title">Share to Social Networks</p>
              <div className="share-card-social">
                <button
                  className="share-card-social-button share-card-social-button--twitter"
                  onClick={handleShareToTwitter}
                  aria-label="Share to Twitter"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </button>
                <button
                  className="share-card-social-button share-card-social-button--facebook"
                  onClick={handleShareToFacebook}
                  aria-label="Share to Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
                <button
                  className="share-card-social-button share-card-social-button--linkedin"
                  onClick={handleShareToLinkedIn}
                  aria-label="Share to LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </button>
                <button
                  className="share-card-social-button share-card-social-button--reddit"
                  onClick={handleShareToReddit}
                  aria-label="Share to Reddit"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  Reddit
                </button>
              </div>
              {navigator.share && (
                <button
                  className="share-card-button share-card-button--native"
                  onClick={handleNativeShare}
                >
                  📱 Share via...
                </button>
              )}
            </div>

            <p className="share-card-modal__note">
              Your trading card includes detailed stats from your digital archaeology.
            </p>
            <canvas
              ref={canvasRef}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              className="share-card-canvas share-card-canvas--hidden"
            />
          </div>
        </div>
      )}
    </>
  )
}
