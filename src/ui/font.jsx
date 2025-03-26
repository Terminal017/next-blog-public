import {
  Roboto,
  Inter,
  Space_Grotesk,
  Orbitron,
  JetBrains_Mono,
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
