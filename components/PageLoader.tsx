"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const FLAG = "saksham-loaded";

export default function PageLoader() {
  // Default: show the loader. We'll hide it on mount if we've already seen it
  // this session, so the first paint always covers the page (no flash).
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(FLAG) === "1";
    } catch {
      seen = true;
    }
    if (seen) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(FLAG, "1");
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[10000] bg-background grid place-items-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-mono text-[13px] tracking-[0.2em] uppercase text-primary"
          >
            Saksham Arora
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
