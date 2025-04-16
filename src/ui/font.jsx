import {
  Roboto,
  Inter,
  Space_Grotesk,
  Orbitron,
  Open_Sans,
  Lato,
  Noto_Sans_SC,
} from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
//现代化字体
export const inter = Inter({ subsets: ["latin"] });
//偏圆润的字体
export const space_Grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});
//标签字体
export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const open_sans = Open_Sans({
  subsets: ["latin"],
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

//思源黑体简体中文
export const note_sans_sc = Noto_Sans_SC({
  subsets: ["latin"],
});
