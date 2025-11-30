import {
  Roboto,
  // Noto_Sans_SC,
} from 'next/font/google'
import localFont from 'next/font/local'

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: false, //禁用自动回调
  preload: true,
  variable: '--font-roboto',
})

export const misans = localFont({
  src: [
    {
      path: './MiSans/woff2/MiSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Normal.woff2',
      weight: '350',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './MiSans/woff2/MiSans-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-misans',
})
