// src/components/PWAInstallPrompt.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
        });
        setShowPrompt(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 bg-secondary text-white p-4 rounded-xl shadow-xl z-50 flex items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold">Install this app?</p>
            <p className="text-sm text-gray-300">
              Experience better performance offline 🔥
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-accent text-white px-4 py-1 rounded hover:opacity-90 transition"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-red-400 hover:underline text-sm"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
