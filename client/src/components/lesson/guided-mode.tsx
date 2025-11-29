import { useAccessibility } from "@/lib/accessibility-context";
import { Lightbulb } from "lucide-react";

export function GuidedModeHighlight({ children, hint }: { children: React.ReactNode; hint?: string }) {
  const { speak } = useAccessibility();

  return (
    <div
      className="relative animate-fadeIn"
      onMouseEnter={() => {
        if (hint) speak(hint);
      }}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-xl opacity-30 animate-pulse blur-sm" />
      {children}
    </div>
  );
}

export function GuidedModeAssistant({ message }: { message: string }) {
  return (
    <div className="fixed bottom-20 left-6 z-30 max-w-xs animate-slideInUp">
      <div className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-lg flex gap-3 items-start">
        <Lightbulb className="h-6 w-6 flex-shrink-0 mt-1" />
        <div>
          <p className="text-lg font-semibold">{message}</p>
          <p className="text-sm opacity-90 mt-1">Tap the highlighted element</p>
        </div>
      </div>
    </div>
  );
}
