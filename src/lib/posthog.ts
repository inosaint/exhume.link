import posthog from 'posthog-js'

export const initPostHog = () => {
  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey) {
    console.warn('PostHog API key not found. Analytics will not be tracked.')
    return
  }

  posthog.init(apiKey, {
    api_host: host || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll manually track section changes as pageviews
    capture_pageleave: true,
    autocapture: false, // Disable autocapture to have more control
    opt_out_capturing_by_default: false,
  })
}

export { posthog }
