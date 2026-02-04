import { useRef, useCallback, useState } from 'react'
import { SHARE_STATS, CATEGORIES } from '../data/mockData'
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

// Load font for canvas (Cinzel from Google Fonts)
async function loadFont(): Promise<void> {
  const font = new FontFace(
    'Cinzel',
    'url(https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnTYrvDE5ZdqU.woff2)'
  )
  await font.load()
  document.fonts.add(font)
}

interface ShareCardProps {
  onClose?: () => void
}

export function ShareCard({ onClose }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsGenerating(true)

    try {
      // Load Cinzel font
      await loadFont()

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

      // Border
      ctx.strokeStyle = COLORS.stone
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40)

      // Top accent line
      ctx.beginPath()
      ctx.moveTo(CARD_WIDTH / 4, 20)
      ctx.lineTo((CARD_WIDTH * 3) / 4, 20)
      ctx.strokeStyle = COLORS.accent
      ctx.lineWidth = 3
      ctx.stroke()

      // Logo text
      ctx.fillStyle = COLORS.textPrimary
      ctx.font = '28px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '8px'
      ctx.fillText('EXHUME.LINK', CARD_WIDTH / 2, 80)

      // Tagline
      ctx.fillStyle = COLORS.textMuted
      ctx.font = '16px Inter, sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillText('YOUR DIGITAL REMAINS, EXHUMED', CARD_WIDTH / 2, 110)

      // Archetype section
      // Volume suffix
      ctx.fillStyle = COLORS.accentDim
      ctx.font = '18px Cinzel, serif'
      ctx.fillText(SHARE_STATS.volumeSuffix.toUpperCase(), CARD_WIDTH / 2, 200)

      // Archetype name
      ctx.fillStyle = COLORS.accent
      ctx.font = 'bold 56px Cinzel, serif'
      ctx.fillText(SHARE_STATS.archetype.toUpperCase(), CARD_WIDTH / 2, 270)

      // Decorative line under archetype
      ctx.beginPath()
      ctx.moveTo(CARD_WIDTH / 3, 300)
      ctx.lineTo((CARD_WIDTH * 2) / 3, 300)
      ctx.strokeStyle = COLORS.stoneLlight
      ctx.lineWidth = 1
      ctx.stroke()

      // Stats row
      const statsY = 380
      const statWidth = 200
      const startX = (CARD_WIDTH - statWidth * 3) / 2

      const stats = [
        { value: SHARE_STATS.totalTabs.toString(), label: 'TABS BURIED' },
        { value: SHARE_STATS.uniqueDomains + '+', label: 'DOMAINS' },
        { value: SHARE_STATS.browsers.toString(), label: 'BROWSERS' },
      ]

      stats.forEach((stat, i) => {
        const x = startX + i * statWidth + statWidth / 2

        // Value
        ctx.fillStyle = COLORS.accent
        ctx.font = 'bold 48px Cinzel, serif'
        ctx.fillText(stat.value, x, statsY)

        // Label
        ctx.fillStyle = COLORS.textMuted
        ctx.font = '12px Inter, sans-serif'
        ctx.letterSpacing = '2px'
        ctx.fillText(stat.label, x, statsY + 30)
      })

      // Top categories section
      ctx.fillStyle = COLORS.textSecondary
      ctx.font = '14px Inter, sans-serif'
      ctx.letterSpacing = '3px'
      ctx.fillText('TOP CATEGORIES', CARD_WIDTH / 2, 480)

      const categoryY = 520
      const categoryWidth = 250
      const categoryStartX = (CARD_WIDTH - categoryWidth * 3) / 2

      SHARE_STATS.topCategories.forEach((cat, i) => {
        const x = categoryStartX + i * categoryWidth + categoryWidth / 2
        const categoryDef = CATEGORIES.find(c => c.id === cat.id)
        const icon = categoryDef?.icon || ''

        // Icon
        ctx.font = '24px sans-serif'
        ctx.fillText(icon, x, categoryY)

        // Category name
        ctx.fillStyle = COLORS.textPrimary
        ctx.font = '14px Inter, sans-serif'
        ctx.fillText(cat.label, x, categoryY + 30)

        // Count
        ctx.fillStyle = COLORS.accentDim
        ctx.font = '12px Inter, sans-serif'
        ctx.fillText(`${cat.count} tabs`, x, categoryY + 50)
      })

      // Footer
      ctx.fillStyle = COLORS.textMuted
      ctx.font = '12px Inter, sans-serif'
      ctx.letterSpacing = '1px'
      ctx.fillText('exhume.link — discover what your tabs say about you', CARD_WIDTH / 2, CARD_HEIGHT - 40)

      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating share card:', error)
    } finally {
      setIsGenerating(false)
    }
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
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'exhume-link-results.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  return (
    <div className="share-card-modal" onClick={onClose}>
      <div className="share-card-content" onClick={e => e.stopPropagation()}>
        <button className="share-card-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h3 className="share-card-title">Share Your Results</h3>

        <div className="share-card-preview">
          <canvas
            ref={canvasRef}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            className="share-card-canvas"
          />
          {!isGenerated && (
            <div className="share-card-placeholder">
              <button
                className="share-card-generate"
                onClick={generateCard}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Card'}
              </button>
            </div>
          )}
        </div>

        {isGenerated && (
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
          </div>
        )}
      </div>
    </div>
  )
}
