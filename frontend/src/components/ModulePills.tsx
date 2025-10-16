"use client";

import React from "react";
import { Building2, Search, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

type Props = {
  activeModule: string | null;
  onSelect: (module: string) => void;
};

const modules = [
  { id: "Property Opinion", label: "Property Opinion", icon: Building2 },
  { id: "Research", label: "Research", icon: Search },
  { id: "Case", label: "Case", icon: FileText },
  { id: "Junior", label: "Junior", icon: Bot }
];

export default function ModulePills({ activeModule, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={activeModule === module.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(module.id)}
                className="gap-2 font-bold whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {module.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
      <Separator />
    </div>
  );
}
