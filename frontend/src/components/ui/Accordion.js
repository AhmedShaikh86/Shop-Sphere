"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between py-4 text-left text-sm text-foreground"
            >
              {item.question}
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && <p className="pb-4 text-sm text-muted">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
