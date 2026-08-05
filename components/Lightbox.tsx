"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/getPhotos";

type Props = {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
};

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null)
        onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft" && index !== null)
        onNavigate((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, photos.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 40) return;
            if (dx < 0) onNavigate((index + 1) % photos.length);
            else onNavigate((index - 1 + photos.length) % photos.length);
          }}
        >
          <motion.div
            key={photos[index].filename}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-10"
          >
            <Image
              src={photos[index].src}
              alt={photos[index].meta.alt ?? photos[index].filename}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/90 hover:text-white p-2"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={() =>
                  onNavigate((index - 1 + photos.length) % photos.length)
                }
                aria-label="Previous"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M16 5l-8 8 8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => onNavigate((index + 1) % photos.length)}
                aria-label="Next"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M10 5l8 8-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {photos[index].meta.location && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-white/90 text-[13px]">
              {photos[index].meta.location}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
