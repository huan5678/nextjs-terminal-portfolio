'use client';
import AsciiHero from "@/app/components/AsciiHero";
import Terminal from "@/app/components/Terminal";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AsciiHero />
      </motion.div>
      <Terminal />
    </main>
  );
}
