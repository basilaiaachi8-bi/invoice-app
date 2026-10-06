import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteModal({ isOpen, onClose, onConfirm, invoiceId }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Scale & Fade */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 bg-white dark:bg-[#1E2139] w-full max-w-[480px] p-8 md:p-12 rounded-3xl shadow-2xl transition-colors duration-300"
          >
            <h2 className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-3">
              Confirm Deletion
            </h2>
            <p className="text-xs text-[#888EB0] dark:text-[#DFE3FA] leading-relaxed mb-6">
              Are you sure you want to delete invoice #{invoiceId}? This action
              cannot be undone and will remove the data permanently.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#FFFFFF] text-[#7E88C3] dark:text-[#DFE3FA] dark:hover:text-[#0C0E16] font-bold text-xs px-6 py-4 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-[#EC5757] hover:bg-[#FF9797] text-white font-bold text-xs px-6 py-4 rounded-full transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
