import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 pointer-events-auto"
        >
          <div
            id="app-toast"
            className={`flex items-center gap-3 p-4 rounded-xl shadow-xl border ${
              toast.type === 'success'
                ? 'bg-[#183928] text-white border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-[#8F2D14] text-white border-rose-500/30'
                : 'bg-[#242A27] text-white border-stone-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-amber-300 shrink-0" />}

            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>

            <button
              onClick={hideToast}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
