"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-system";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className, animate = true }: CardProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      className={cn(
        "p-8 rounded-2xl bg-white shadow-md",
        "space-y-5", // 20px spacing between elements
        className
      )}
      {...(animate ? {
        initial: motionVariants.slideUp.initial,
        animate: motionVariants.slideUp.animate,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      } : {})}
    >
      {children}
    </Component>
  );
}

