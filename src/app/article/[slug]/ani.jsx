"use client";
import { motion } from "framer-motion";

export default function ArticleLayoutWrapper({ children }) {
  return (
    <motion.main
      className="article-details-page relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}
