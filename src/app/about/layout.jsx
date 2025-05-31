export const metadata = {
  title: "关于星轨",
  description: "The information station of the Orbital Command Center",
  keywords: ["Next.js", "React", "blog", "frontend", "Star Trails"],

  openGraph: {
    title: "Star Trails Articles",
    description: "Well, hello world!",
    url: "https://startrails.site/article",
    type: "website",
    images: [
      {
        url: "https://startrails.site/favicon.svg",
        width: 1200,
        height: 630,
        alt: "The Icon of the BASE",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Star Trails Articles",
    description: "Well, hello world!",
    images: ["https://startrails.site/favicon.svg"],
  },
}

export default function AboutLayout({ children }) {
  return children
}
