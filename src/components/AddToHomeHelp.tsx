import { useState, useMemo } from "react";
import { Smartphone, X, PlusSquare, Share2 } from "lucide-react";

export default function AddToHomeHelp() {
  const [open, setOpen] = useState(false);

  const platform = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
    return "desktop";
  }, []);

  return (
    <>
      <div className="flex justify-center">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center  gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition text-sm"
      >
        <PlusSquare className="w-4 h-4" />
        Add to Home Screen
      </button>

      </div>

      {open && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md glass-panel p-5 rounded-2xl border border-border/40 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Smartphone className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  Add to Home Screen
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Install this safety app for faster access to SOS and live risk updates.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {platform === "android" && (
                <ul className="space-y-2">
                  <li>1. Tap the <b>⋮ Menu</b> in your browser</li>
                  <li>2. Select <b>Add to Home Screen</b></li>
                  <li>3. Confirm to install</li>
                </ul>
              )}

              {platform === "ios" && (
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Tap the <b>Share</b> button
                  </li>
                  <li>2. Choose <b>Add to Home Screen</b></li>
                  <li>3. Tap <b>Add</b></li>
                </ul>
              )}

              {platform === "desktop" && (
                <ul className="space-y-2">
                  <li>1. Open browser menu (⋮ or ☰)</li>
                  <li>2. Click <b>Install App</b> or <b>Add to Home Screen</b></li>
                  <li>3. Confirm installation</li>
                </ul>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
