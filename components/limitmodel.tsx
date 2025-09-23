// components/LimitModal.tsx
"use client";

import React from "react";
import { toast } from "sonner";

type LimitInfo = {
  message: string;
  nextAvailable?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  info: LimitInfo | null;
};

function formatLocal(dateInput: string | number | Date) {
  try {
    const d = new Date(dateInput);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(dateInput);
  }
}

export default function LimitModal({ open, onClose, info }: Props) {
  if (!open || !info) return null;

  const handleClose = () => {
    toast("Okay — you can try again later.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg mx-auto bg-card border rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Generation limit reached</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {info.message ??
            "You have reached the limit of 3 file generations per day."}
        </p>

        {info.nextAvailable ? (
          <div className="mb-4">
            <p className="text-sm">
              Next attempt:{" "}
              <strong>{formatLocal(info.nextAvailable)} (IST)</strong>
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm">Please try again after 24 hours.</p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-md bg-primary text-white"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Note: This is an informational message. If you believe this is an
          error, contact support.
        </p>
      </div>
    </div>
  );
}
