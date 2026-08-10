"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VoronoiCanvas from "./VoronoiCanvas";

const NAMES = [
  "Saksham Arora",
  "सक्षम अरोड़ा",
  "ਸਕਸ਼ਮ ਅਰੋੜਾ",
  "萨克沙姆·阿罗拉",
  "サクシャム・アロラ",
  "Сакшам Арора",
  "สักชัม อาโรลา",
  "삭샴",
  "ساكشام",
];

// Font mapping for each name index
const NAME_FONTS = [
  "font-[family-name:var(--font-instrument)]",     // English - Instrument Serif
  "font-[family-name:var(--font-poppins)]",        // Hindi - Poppins
  "font-[family-name:var(--font-playfair)]",       // Punjabi - Playfair (fallback)
  "font-[family-name:var(--font-noto-sc)]",         // Chinese - Noto Serif SC
  "font-[family-name:var(--font-noto-jp)]",         // Japanese - Noto Serif JP
  "font-[family-name:var(--font-playfair)]",       // Russian - Playfair
  "font-[family-name:var(--font-krub)]",           // Thai - Krub
  "font-[family-name:var(--font-nanum)]",           // Korean - Nanum Myeongjo
  "font-[family-name:var(--font-amiri)]",           // Arabic - Amiri
];

const TYPE_SPEED = 110;
const DELETE_SPEED = 65;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;
// Switch this to "typewriter" to restore the character-by-character effect.
const NAME_EFFECT: "typewriter" | "fade" = "fade";
const FADE_NAME_DURATION = 3500;

function TypewriterName() {
  const [displayed, setDisplayed] = useState("");
  const [nameIdx, setNameIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting" | "pause-empty">("typing");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const target = NAMES[nameIdx];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, TYPE_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
      }
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, DELETE_SPEED);
      } else {
        setPhase("pause-empty");
      }
    } else if (phase === "pause-empty") {
      timeoutRef.current = setTimeout(() => {
        setNameIdx((i) => (i + 1) % NAMES.length);
        setPhase("typing");
      }, PAUSE_AFTER_DELETE);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, nameIdx]);

  const handleClick = () => {
    setNameIdx((i) => (i + 1) % NAMES.length);
    setDisplayed("");
    setPhase("typing");
  };
  const currentFontClass = NAME_FONTS[nameIdx];

  return (
    <span
      className="inline-flex items-baseline whitespace-nowrap cursor-pointer select-none"
      onClick={handleClick}
      title="Show next language"
    >
      <span className={currentFontClass}>{displayed}</span>
      <span
        aria-hidden
        className="ml-[2px] inline-block w-[3px] self-stretch bg-current align-middle animate-[blink_1s_step-end_infinite]"
        style={{ marginBottom: "0.08em", marginTop: "0.08em" }}
      />
    </span>
  );
}

function FadeName() {
  const [nameIdx, setNameIdx] = useState(0);
  const currentName = NAMES[nameIdx];

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setNameIdx((i) => (i + 1) % NAMES.length),
      FADE_NAME_DURATION
    );
    return () => window.clearTimeout(timeout);
  }, [nameIdx]);

  return (
    <span
      className="inline-block whitespace-nowrap cursor-pointer select-none"
      onClick={() => setNameIdx((i) => (i + 1) % NAMES.length)}
      title="Show next language"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className={`inline-block whitespace-nowrap ${NAME_FONTS[nameIdx]}`}
        >
          {currentName}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const highlights = [
  "Causal inference (DML) for Flipkart homepage A/B experiments",
  "+3% page views · +5% homepage revenue from low-propensity launch",
  "Real-time XGBoost feed-refresh model · Kafka monitoring at BBD scale",
  "Incoming MS Statistics & Computer Science, Purdue · Aug 2026",
];

function ProfilePhoto({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  const list = photos.length > 0 ? photos : ["/Profile Photo.png"];

  const handleClick = () => {
    if (list.length < 2) return;
    setIdx((i) => (i + 1) % list.length);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        list.length > 1 ? "Show next profile photo" : "Profile photo"
      }
      className={`relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden shadow-lg ${
        list.length > 1 ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={list[idx]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={list[idx]}
            alt="Saksham Arora"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default function Hero({
  profilePhotos = [],
}: {
  profilePhotos?: string[];
}) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
    >
      <VoronoiCanvas />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--primary) / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--primary) / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-b from-background/0 to-background"
      />

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-6xl px-6 md:px-12 pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <ProfilePhoto photos={profilePhotos} />
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-primary leading-[0.95]">
                <span className="block italic text-secondary text-[28px] sm:text-[34px] md:text-[40px] mb-1 font-[family-name:var(--font-instrument)]">
                  Hi, I am
                </span>
                <span className="block font-display text-[clamp(40px,8vw,112px)] tracking-[-0.02em] min-h-[1.05em]">
                  {NAME_EFFECT === "typewriter" ? <TypewriterName /> : <FadeName />}
                </span>
              </h1>

              <div className="mt-6 h-px w-12 bg-accent/70 mx-auto md:mx-0" />

              <p className="mt-6 max-w-[620px] text-[15px] md:text-[16px] leading-[1.65] text-secondary mx-auto md:mx-0">
  I am a graduate student at{" "}
  <a 
    href="https://www.purdue.edu" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-accent hover:underline"
  >
    Purdue University
  </a>
  , pursuing Joint Master&apos;s in Statistics and Computer Science. I did my undergrad in Chemical Engineering from{" "}
  <a 
    href="https://www.iitk.ac.in" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-accent hover:underline"
  >
    IIT Kanpur
  </a>
  , India. I love understanding data and find interesting patterns in it, so Quant finance and Machine Learning interests me the most (I recently passed the CFA Level 1 exam!). I sometimes fumble towards the visual side of data, hence I love Photography. I play badminton often, chess is the second game I love to play.
</p>

              <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-7 gap-y-3">
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 text-[14px] text-accent"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                  <span className="border-b border-accent/40 group-hover:border-accent transition-colors">
                    projects
                  </span>
                </Link>
                <a
                  href="#photography"
                  className="group inline-flex items-center gap-2 text-[14px] text-secondary hover:text-primary transition-colors"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                  <span className="border-b border-border group-hover:border-primary/40 transition-colors">
                    check out my photography
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <a
        href="#photography"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-secondary"
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </a>
    </section>
  );
}
