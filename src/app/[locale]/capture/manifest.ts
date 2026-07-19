import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lonara — My Fuel',
    short_name: 'My Fuel',
    description: 'Scan your meals',
    start_url: '/capture',
    scope: '/capture',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#1D9E75',
    icons: [
      {
        src: '/logovertmyfuel.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logovertmyfuel.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}