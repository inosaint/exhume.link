import { useCallback, useState, useEffect, useRef } from 'react'
import { toPng, toBlob } from 'html-to-image'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './ShareCard.css'

interface ShareCardProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function ShareCard({ profile, stats }: ShareCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null)
  const [cardBlob, setCardBlob] = useState<Blob | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [instagramMsg, setInstagramMsg] = useState(false)
  const captureAttempted = useRef(false)

  const captureCard = useCallback(async () => {
    const cardEl = document.querySelector('.trading-card-3d__inner') as HTMLElement
    if (!cardEl) return

    setIsCapturing(true)
    try {
      const [dataUrl, blob] = await Promise.all([
        toPng(cardEl, { pixelRatio: 2, cacheBust: true }),
        toBlob(cardEl, { pixelRatio: 2, cacheBust: true }),
      ])
      if (dataUrl) setCardDataUrl(dataUrl)
      if (blob) setCardBlob(blob)
    } catch (err) {
      console.error('Failed to capture card:', err)
    } finally {
      setIsCapturing(false)
    }
  }, [])

  useEffect(() => {
    function handleShareRequest() {
      setShowShareModal(true)
    }
    window.addEventListener('share-card-request', handleShareRequest)
    return () => window.removeEventListener('share-card-request', handleShareRequest)
  }, [])

  useEffect(() => {
    if (showShareModal && !cardDataUrl && !isCapturing && !captureAttempted.current) {
      captureAttempted.current = true
      captureCard()
    }
  }, [showShareModal, cardDataUrl, isCapturing, captureCard])

  const handleDownload = useCallback(() => {
    if (!cardDataUrl) return
    const link = document.createElement('a')
    link.download = 'exhume-archetype.png'
    link.href = cardDataUrl
    link.click()
  }, [cardDataUrl])

  // Direct download handler - must come after handleDownload is defined
  useEffect(() => {
    async function handleDownloadRequest() {
      // Capture the card if we haven't already
      if (!cardDataUrl && !isCapturing && !captureAttempted.current) {
        captureAttempted.current = true
        await captureCard()
      }
      // Download after a brief delay to ensure capture is complete
      setTimeout(() => {
        if (cardDataUrl) {
          handleDownload()
        } else {
          // If still not ready, capture and download
          captureCard().then(() => {
            setTimeout(() => {
              if (cardDataUrl) handleDownload()
            }, 500)
          })
        }
      }, 100)
    }
    window.addEventListener('download-card-request', handleDownloadRequest)
    return () => window.removeEventListener('download-card-request', handleDownloadRequest)
  }, [cardDataUrl, isCapturing, captureCard, handleDownload])

  const handleCopyImage = useCallback(async () => {
    if (!cardBlob) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': cardBlob }),
      ])
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      handleDownload()
    }
  }, [cardBlob, handleDownload])

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

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      console.error('Failed to copy link')
    }
  }, [getShareUrl])

  const shareText = `I'm a ${profile.title}! I've exhumed ${stats.totalTabs} tabs across ${stats.uniqueDomains} domains. What's your digital afterlife profile?`

  const handleShareToTwitter = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}&hashtags=ExhumeLink`
    window.open(url, '_blank', 'width=550,height=420')
  }, [shareText, getShareUrl])

  const handleShareToFacebook = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`
    window.open(url, '_blank', 'width=550,height=420')
  }, [getShareUrl])

  const handleShareToBluesky = useCallback(() => {
    const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText + '\n' + getShareUrl())}`
    window.open(url, '_blank', 'width=550,height=520')
  }, [shareText, getShareUrl])

  const handleShareToInstagram = useCallback(() => {
    handleDownload()
    setInstagramMsg(true)
    setTimeout(() => setInstagramMsg(false), 3000)
  }, [handleDownload])

  const handleShareToReddit = useCallback(() => {
    const title = `I'm a ${profile.title}! Check out my digital archaeology profile`
    const url = `https://www.reddit.com/submit?url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(title)}`
    window.open(url, '_blank', 'width=550,height=420')
  }, [getShareUrl, profile.title])

  const handleNativeShare = useCallback(async () => {
    if (!('share' in navigator)) return
    try {
      await navigator.share({
        title: `I'm a ${profile.title}!`,
        text: shareText,
        url: getShareUrl(),
      })
    } catch {
      // cancelled
    }
  }, [getShareUrl, profile.title, shareText])

  const cardReady = !!cardDataUrl

  return (
    <>
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
                &times;
              </button>
            </div>

            <p className="share-card-modal__title">Choose your ritual.</p>

            {isCapturing && (
              <p className="share-card-modal__note">Preparing your archetype card&hellip;</p>
            )}

            <div className="share-card-grid">
              {/* ── Actions ── */}
              <button className="share-card-tile" onClick={handleDownload} disabled={!cardReady}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download</span>
              </button>

              <button className="share-card-tile" onClick={handleCopyImage} disabled={!cardReady}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copySuccess ? 'Copied!' : 'Copy Image'}</span>
              </button>

              <button className="share-card-tile" onClick={handleCopyLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {/* ── Social ── */}
              <button
                className="share-card-tile share-card-tile--twitter"
                onClick={handleShareToTwitter}
                aria-label="Share to X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X</span>
              </button>

              <button
                className="share-card-tile share-card-tile--facebook"
                onClick={handleShareToFacebook}
                aria-label="Share to Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>

              <button
                className="share-card-tile share-card-tile--bluesky"
                onClick={handleShareToBluesky}
                aria-label="Share to Bluesky"
              >
                <svg viewBox="0 0 568 501" fill="currentColor" width="24" height="24">
                  <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.889-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C10.045 203.66.1 75.293.1 57.947.1-28.906 76.254-1.611 123.121 33.664z" />
                </svg>
                <span>Bluesky</span>
              </button>

              <button
                className="share-card-tile share-card-tile--instagram"
                onClick={handleShareToInstagram}
                disabled={!cardReady}
                aria-label="Share to Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>{instagramMsg ? 'Image saved!' : 'Instagram'}</span>
              </button>

              <button
                className="share-card-tile share-card-tile--reddit"
                onClick={handleShareToReddit}
                aria-label="Share to Reddit"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                <span>Reddit</span>
              </button>

              {'share' in navigator && (
                <button
                  className="share-card-tile share-card-tile--native"
                  onClick={handleNativeShare}
                  aria-label="Share via device"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Share via&hellip;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
