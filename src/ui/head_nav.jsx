"use client";

import "@/styles/nav.css";
import "@/styles/globals.css";
import { roboto } from "./fonts/font";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mode, setMode] = useState("light"); //定义深浅模式的state
  const pathname = usePathname();

  useEffect(() => {
    const match = document.cookie.match(/theme=(dark|light)/);
    let theme = match ? match[1] : null;

    //如果没有 cookie，则检测系统偏好
    if (!theme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      theme = prefersDark ? "dark" : "light";
      document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }

    setMode(theme);
    document.documentElement.className = theme;
  }, []);

  //切换深浅模式函数
  function changemode() {
    const newmode = mode === "light" ? "dark" : "light";
    setMode(newmode);
    document.documentElement.classList = newmode;
    document.cookie = `theme=${newmode}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  const navlist = [
    { name: "主页", path: "/" },
    { name: "文章", path: "/article" },
    { name: "项目", path: "/project" },
    { name: "关于", path: "/about" },
  ];

  return (
    <header className="header">
      <nav>
        <div className="nav-container bg-surface">
          <Link href="/" className="nav-left text-on-surface">
            <svg
              alt="logo"
              className="logo-svg"
              width="40"
              height="40"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="currentColor"
                strokeWidth="15"
                fill="none"
              />

              <rect
                x="68"
                y="68"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="15"
                transform="rotate(45 100 100)"
              />
            </svg>
            <div className="blog-title">
              <span
                className={roboto.className}
                style={{ fontWeight: "700 ", fontSize: "1.5rem" }}
              >
                Terminal.ntc
              </span>
            </div>
          </Link>
          <div className="nav-right">
            <div className="nav-links">
              {navlist.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className={
                    "text-on-surface hover:text-on-third-container hover:bg-third-container " +
                    (pathname === item.path ? "bg-third-container" : "")
                  }
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div role="separator" className="separator bg-outline-v/50"></div>
            <div className="nav-mode text-on-surface hover:bg-third-container hover:text-on-third-container">
              {/* 切换深色和浅色模式 */}
              <button type="button" onClick={changemode}>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22px"
                  viewBox="0 -960 960 960"
                  width="22px"
                  fill="currentColor"
                  animate={{ rotate: mode === "light" ? 180 : 0 }}
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                >
                  <path
                    d={
                      mode === "light"
                        ? "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"
                        : "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"
                    }
                  />
                </motion.svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
