"use client";

import { motion } from "framer-motion";

/**
 * Loading / skeleton states for dynamic components.
 * These match the iKingdom design language: light backgrounds,
 * gold accent pulses, monospace labels, cinematic easing.
 */

/* ── Base shimmer block ─────────────────────────────── */

type SkeletonBlockProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function SkeletonBlock({
  className = "",
  width,
  height,
}: SkeletonBlockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-[--color-bg-elevated] ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[--color-line]/60 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.4,
        }}
      />
    </div>
  );
}

/* ── Section skeleton (hero-level full block) ────────── */

export function SectionSkeleton() {
  return (
    <div className="py-32 md:py-48 border-t border-[--color-line]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-20">
          <div className="h-px w-8 bg-[--color-line-strong]" />
          <SkeletonBlock width="120px" height="12px" />
        </div>

        {/* Headline placeholder */}
        <div className="space-y-4">
          <SkeletonBlock width="80%" height="48px" className="max-w-3xl" />
          <SkeletonBlock width="60%" height="48px" className="max-w-2xl" />
        </div>

        {/* Body text placeholder */}
        <div className="mt-12 space-y-3 max-w-2xl">
          <SkeletonBlock width="100%" height="16px" />
          <SkeletonBlock width="95%" height="16px" />
          <SkeletonBlock width="70%" height="16px" />
        </div>
      </div>
    </div>
  );
}

/* ── Card skeleton (for proof cards, capabilities, etc.) */

export function CardSkeleton() {
  return (
    <div className="border border-[--color-line-strong] bg-[--color-bg-card] rounded-md p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Label row */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="block h-1.5 w-1.5 rounded-full bg-[--color-line-strong]" />
        <SkeletonBlock width="140px" height="10px" />
      </div>

      {/* Big number / stat */}
      <SkeletonBlock width="120px" height="40px" className="mb-6" />

      {/* Progress bar */}
      <div className="h-1 bg-[--color-line] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[--color-line-strong] rounded-full"
          animate={{ width: ["20%", "70%", "45%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-[--color-line-strong]">
        <SkeletonBlock width="80%" height="8px" />
      </div>
    </div>
  );
}

/* ── Tier row skeleton (for the method ladder) ────────── */

export function TierRowSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="border-t border-[--color-line]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-b border-[--color-line] grid grid-cols-12 items-baseline gap-4 py-6 md:py-8"
        >
          <div className="col-span-2 md:col-span-1 pl-2 md:pl-4">
            <SkeletonBlock width="24px" height="14px" />
          </div>
          <div className="col-span-7 md:col-span-9">
            <SkeletonBlock
              width={`${50 + Math.random() * 35}%`}
              height="28px"
            />
          </div>
          <div className="col-span-3 md:col-span-2 flex justify-end pr-2 md:pr-4">
            <SkeletonBlock width="60px" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Console / operations skeleton ────────────────────── */

export function ConsoleSkeleton() {
  return (
    <div className="border border-[--color-line-strong] bg-[--color-bg-card] rounded-md overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[--color-line]">
        <motion.span
          className="block h-2 w-2 rounded-full bg-[--color-accent]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <SkeletonBlock width="180px" height="10px" />
        <div className="flex-1" />
        <SkeletonBlock width="80px" height="10px" />
      </div>

      {/* Body rows */}
      <div className="p-5 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBlock width="28px" height="10px" />
            <SkeletonBlock
              width={`${40 + Math.random() * 50}%`}
              height="12px"
            />
            <div className="flex-1" />
            <span className="block h-1.5 w-1.5 rounded-full bg-[--color-line-strong]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Full page loading state ──────────────────────────── */

export default function PageLoading() {
  return (
    <div className="min-h-screen bg-[--color-bg]">
      {/* Nav skeleton */}
      <div className="h-16 md:h-20 flex items-center max-w-[1400px] mx-auto px-6 md:px-10">
        <SkeletonBlock width="120px" height="28px" />
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-8">
          <SkeletonBlock width="50px" height="12px" />
          <SkeletonBlock width="50px" height="12px" />
          <SkeletonBlock width="50px" height="12px" />
          <SkeletonBlock width="80px" height="36px" className="rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
        <div className="flex items-center gap-3 mb-14">
          <div className="h-px w-8 bg-[--color-line-strong]" />
          <SkeletonBlock width="200px" height="12px" />
        </div>
        <div className="space-y-4">
          <SkeletonBlock width="90%" height="64px" className="max-w-4xl" />
          <SkeletonBlock width="70%" height="64px" className="max-w-3xl" />
        </div>
        <div className="mt-16 space-y-3 max-w-2xl">
          <SkeletonBlock width="100%" height="16px" />
          <SkeletonBlock width="90%" height="16px" />
          <SkeletonBlock width="65%" height="16px" />
        </div>
      </div>
    </div>
  );
}
