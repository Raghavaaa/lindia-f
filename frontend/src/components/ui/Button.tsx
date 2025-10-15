"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  variant = "primary", 
  children, 
  className,
  onClick,
  disabled,
  type = "button"
}: ButtonProps) {
  const baseStyles = "h-12 px-6 rounded-2xl text-sm font-medium transition-all duration-300 inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#2E7CF6] text-white shadow-sm",
    secondary: "bg-white text-[#0A0A0A] border border-[#C4C4C4] hover:border-[#2E7CF6]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.button>
  );
}

