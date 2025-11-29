import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Zap } from "lucide-react";

export function MockCamera() {
  const [hasFlash, setHasFlash] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleShutter = () => {
    setHasFlash(true);
    setCaptured(true);
    setTimeout(() => setHasFlash(false), 200);
    setTimeout(() => setCaptured(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 overflow-hidden">
        <CardContent className="pt-0 pb-0 relative">
          <div className="relative w-full aspect-square bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center">
            {hasFlash && (
              <div className="absolute inset-0 bg-white dark:bg-black animate-pulse" />
            )}
            {captured && !hasFlash && (
              <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-20" />
            )}
            <div className="flex flex-col items-center gap-4 text-center p-6">
              <div className="h-20 w-20 rounded-full border-4 border-primary bg-primary/10" />
              <p className="text-lg font-semibold text-foreground">
                Camera Preview
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center items-end h-32">
        <button
          onClick={() => {}}
          className="h-12 w-12 rounded-full bg-muted border-2 border-border flex items-center justify-center hover-elevate active-elevate-2"
          data-testid="button-flash-toggle"
        >
          <Zap className="h-6 w-6 text-warning" />
        </button>

        <button
          onClick={handleShutter}
          className="h-24 w-24 rounded-full bg-primary border-4 border-primary-foreground/30 flex items-center justify-center hover-elevate active-elevate-2 transition-transform"
          data-testid="button-shutter"
        >
          <div className="h-20 w-20 rounded-full bg-primary-foreground/20 border-3 border-primary-foreground flex items-center justify-center">
            <Camera className="h-10 w-10 text-primary-foreground" />
          </div>
        </button>

        <button
          onClick={() => {}}
          className="h-12 w-12 rounded-full bg-muted border-2 border-border flex items-center justify-center hover-elevate active-elevate-2"
          data-testid="button-flip-camera"
        >
          <span className="text-xl font-bold text-foreground">↔</span>
        </button>
      </div>

      {captured && (
        <Card className="border-2 border-success/30 bg-success/5">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-lg font-semibold text-success animate-fadeIn">
              ✓ Photo captured successfully!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
