"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const CLOTHING_SIZES = [
  { size: "XS", chest: '32-33"', waist: '25-26"' },
  { size: "S", chest: '34-35"', waist: '27-28"' },
  { size: "M", chest: '36-38"', waist: '29-31"' },
  { size: "L", chest: '39-41"', waist: '32-34"' },
  { size: "XL", chest: '42-44"', waist: '35-37"' },
];

const SHOE_SIZES = [
  { us: "7", uk: "6", eu: "40" },
  { us: "8", uk: "7", eu: "41" },
  { us: "9", uk: "8", eu: "42" },
  { us: "10", uk: "9", eu: "43" },
  { us: "11", uk: "10", eu: "44" },
];

export function SizeGuide({ isShoe = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="focus-ring text-xs uppercase tracking-wide text-muted underline hover:text-foreground"
      >
        Size Guide
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Size Guide">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              {isShoe ? (
                <>
                  <th className="py-2">US</th>
                  <th className="py-2">UK</th>
                  <th className="py-2">EU</th>
                </>
              ) : (
                <>
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Waist</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(isShoe ? SHOE_SIZES : CLOTHING_SIZES).map((row) => (
              <tr key={row.size || row.us} className="border-b border-border/60">
                {isShoe ? (
                  <>
                    <td className="py-2">{row.us}</td>
                    <td className="py-2">{row.uk}</td>
                    <td className="py-2">{row.eu}</td>
                  </>
                ) : (
                  <>
                    <td className="py-2">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.waist}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-muted">Measurements are approximate. For a precise fit, compare to a similar item you already own.</p>
      </Modal>
    </>
  );
}
