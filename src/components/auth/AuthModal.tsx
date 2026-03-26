"use client";

import { Sparkles, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
}

export function AuthModal({ 
  isOpen, 
  onClose,
  title = "A Safe Space Awaits ✨",
  description = "Join our anonymous community to share, listen, and grow together."
}: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-[#fcfbf9] rounded-[2rem] shadow-2xl p-8 w-full max-w-sm relative text-center border border-[#e8e4db]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#8a9a86]/60 hover:text-[#8a9a86] transition-colors p-1.5 rounded-full hover:bg-[#8a9a86]/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#eef2ed] flex items-center justify-center mx-auto mb-5 border border-[#d6e0d4] shadow-sm relative overflow-hidden">
                <Sparkles className="w-6 h-6 text-[#6b8f66] relative z-10" />
            </div>

            <h2 className="heading-serif text-2xl text-[#2c332b] mb-3 tracking-tight">{title}</h2>
            <div className="text-[#5c6659] text-[15px] leading-relaxed mb-7 px-1">
              {description}
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/auth/signin" onClick={onClose} className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-[#6b8f66] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#5a7a56] transition-all shadow-md"
                >
                  Sign In
                </motion.button>
              </Link>
              <button 
                onClick={onClose}
                className="w-full py-3 text-sm rounded-2xl text-[#8a9a86] font-semibold hover:text-[#5c6659] hover:bg-[#8a9a86]/5 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
