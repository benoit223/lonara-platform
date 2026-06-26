import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lonara — My Fuel',
  description: 'Scan your meals for longevity tracking',
  manifest: '/capture/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'My Fuel',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function CaptureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}