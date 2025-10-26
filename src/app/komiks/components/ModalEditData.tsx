"use client";

import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect } from "react";

export default function ModalEditData({ item, onClose }) {
  // 🔒 Lock body scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔒 Prevent click dari tembus ke background
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <ShowcaseSection
        title="Edit Data Komik"
        className="w-64 space-y-5.5 !p-6.5 md:w-96"
      >
        <div className="" onClick={(e) => e.stopPropagation()}>
          <p className="text-center text-gray-700 dark:text-gray-300">
            <strong className="">{item.judul}</strong>
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 dark:bg-dark-3 dark:hover:bg-dark-4"
            >
              Cancel
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Save
            </button>
          </div>
        </div>
      </ShowcaseSection>
    </div>
  );
}
