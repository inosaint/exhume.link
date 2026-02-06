import { useRef, useCallback, useState, useEffect } from 'react'
import { PersonalityCard } from './PersonalityCard'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './ShareCard.css'

// Card dimensions for OG/social share
const CARD_WIDTH = 1200
const CARD_HEIGHT = 630

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

      // Background
      ctx.fillStyle = COLORS.bgDeep
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

      // Subtle gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
      gradient.addColorStop(0, 'rgba(18, 18, 26, 0.5)')
      gradient.addColorStop(1, 'rgba(10, 10, 14, 0.8)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

      // Portrait (preserve aspect ratio)
      const portraitBox = 220
      const portraitX = (CARD_WIDTH - portraitBox) / 2
      const portraitY = 80
      const scale = Math.min(portraitBox / portrait.width, portraitBox / portrait.height)
      const drawW = portrait.width * scale
      const drawH = portrait.height * scale
      ctx.drawImage(
        portrait,
        portraitX + (portraitBox - drawW) / 2,
        portraitY + (portraitBox - drawH) / 2,
        drawW,
        drawH
      )

      // Title
      const titleText = profile.title.toUpperCase()
      ctx.fillStyle = COLORS.accent
      ctx.font = 'bold 48px Cinzel, serif'
      ctx.textAlign = 'center'
      const titleLines = wrapText(ctx, titleText, CARD_WIDTH * 0.78)
      const titleStartY = portraitY + portraitBox + 70
      titleLines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, CARD_WIDTH / 2, titleStartY + index * 52)
      })

      // Description
      ctx.fillStyle = COLORS.textSecondary
      ctx.font = '18px Inter, sans-serif'
      const descLines = wrapText(ctx, profile.description, CARD_WIDTH * 0.76)
      const descStartY = titleStartY + 70
      descLines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, CARD_WIDTH / 2, descStartY + index * 26)
      })

      // Stats row
      const statsY = CARD_HEIGHT - 110
      const statWidth = 260
      const startX = (CARD_WIDTH - statWidth * 3) / 2

      const shareStats = [
        { value: stats.totalTabs.toString(), label: 'TABS' },
        { value: stats.uniqueDomains.toString(), label: 'DOMAINS' },
        { value: `${stats.topDomain?.domain ?? '—'} (${stats.topDomain?.count ?? 0})`, label: 'TOP DOMAIN' },
      ]

      shareStats.forEach((stat, i) => {
        const x = startX + i * statWidth + statWidth / 2
        const chipWidth = 220
        const chipHeight = 56
        const chipX = x - chipWidth / 2
        const chipY = statsY - 36

        ctx.fillStyle = 'rgba(10, 10, 14, 0.5)'
        drawRoundedRect(ctx, chipX, chipY, chipWidth, chipHeight, 10)
        ctx.fill()

        ctx.fillStyle = COLORS.textPrimary
        ctx.font = 'bold 18px Cinzel, serif'
        ctx.fillText(stat.value, x, statsY - 6)

        ctx.fillStyle = COLORS.textMuted
        ctx.font = '12px Inter, sans-serif'
        drawLetterSpacedText(ctx, stat.label, x, statsY + 16, 2, 'center')
      })

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
            <div className="share-card-actions">
              <button
                className="share-card-button share-card-button--copy"
                onClick={handleCopyToClipboard}
              >
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                className="share-card-button share-card-button--download"
                onClick={handleDownload}
              >
                Download PNG
              </button>
              <button
                className="share-card-button share-card-button--link"
                onClick={handleCopyShareLink}
              >
                {linkCopied ? 'Link Copied' : 'Copy Share Link'}
              </button>
            </div>
            <p className="share-card-modal__note">
              Link includes a compact JSON snapshot in the URL.
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
