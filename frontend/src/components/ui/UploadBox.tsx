"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  onUpload?: (files: FileList) => void;
  className?: string;
  text?: string;
}

export function UploadBox({ 
  onUpload, 
  className,
  text = "Upload Files" 
}: UploadBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onUpload) {
      onUpload(e.target.files);
    }
  };

  return (
    <motion.label
      className={cn(
        "w-[400px] h-[220px] max-w-full",
        "border-2 border-dashed border-[#C4C4C4] rounded-2xl",
        "flex flex-col items-center justify-center",
        "cursor-pointer transition-colors duration-300",
        "hover:border-[#2E7CF6]",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <Upload className="w-12 h-12 text-[#555555]" />
      <span className="mt-3 text-base text-[#555555]">{text}</span>
    </motion.label>
  );
}

