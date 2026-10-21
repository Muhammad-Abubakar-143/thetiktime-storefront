'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useMemo } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  once = true,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
  once?: boolean;
}

export function Stagger({
  children,
  delay = 0,
  stagger = 0.08,
  className,
  once = true,
}: StaggerProps) {
  const variants = useMemo<Variants>(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: stagger, delayChildren: delay },
      },
    }),
    [delay, stagger]
  );
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  once = true,
  as = 'h1',
}: SplitTextProps) {
  const words = useMemo(() => text.split(' '), [text]);
  const MotionTag = motion[as];
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: '100%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-40px' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span variants={child} className="inline-block">
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
