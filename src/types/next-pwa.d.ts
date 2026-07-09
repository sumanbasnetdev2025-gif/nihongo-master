declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  interface PWAConfig {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    scope?: string
    sw?: string
    runtimeCaching?: unknown[]
    buildExcludes?: (string | RegExp)[]
    publicExcludes?: string[]
    fallbacks?: Record<string, string>
    cacheOnFrontEndNav?: boolean
    reloadOnOnline?: boolean
    dynamicStartUrl?: boolean
    cacheStartUrl?: boolean
  }

  export default function withPWAInit(
    config?: PWAConfig
  ): (nextConfig: NextConfig) => NextConfig
}