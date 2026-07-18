import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Lonara — My Visual',
  description: 'Guided facial and body capture for visual vitality analysis',
  manifest: '/visual-capture/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'My Visual',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function VisualCaptureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}