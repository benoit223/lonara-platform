import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localeDetection: false
})

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Cas spécial — PWA My Visual relancée sans préfixe de locale dans l'URL
  if (pathname === '/visual-capture' || pathname.startsWith('/visual-capture/')) {
    const savedLocale = req.cookies.get('lonara_visual_locale')?.value
    if (savedLocale && ['en', 'fr', 'es'].includes(savedLocale)) {
      const url = req.nextUrl.clone()
      url.pathname = `/${savedLocale}${pathname}`
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}