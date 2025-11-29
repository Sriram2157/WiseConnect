import { useState } from "react";
import { HelpCircle, X, Phone, Download, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAccessibility } from "@/lib/accessibility-context";

export function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { speak } = useAccessibility();

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      family: "Calling a family member. This is a practice feature.",
      screenshot: "Taking a screenshot. In a real app, this would be sent to support.",
      replay: "Replaying the last instructions. Listen carefully.",
    };
    
    if (messages[action]) {
      speak(messages[action]);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 md:bottom-8 right-6 z-40 h-16 w-16 rounded-full bg-destructive text-destructive-foreground shadow-lg hover-elevate active-elevate-2 flex items-center justify-center animate-bounce-subtle"
        data-testid="button-sos"
        aria-label="Help button"
      >
        <HelpCircle className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <Card className="fixed bottom-48 md:bottom-24 right-6 z-50 w-72 border-2 border-destructive/30 bg-destructive/5 animate-slideInUp">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Need Help?</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover-elevate rounded-lg"
                data-testid="button-close-sos"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={() => handleAction("family")}
              className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover-elevate active-elevate-2 flex items-center justify-center gap-3"
              data-testid="button-call-family"
            >
              <Phone className="h-5 w-5" />
              Call Family
            </button>

            <button
              onClick={() => handleAction("screenshot")}
              className="w-full px-4 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover-elevate active-elevate-2 flex items-center justify-center gap-3"
              data-testid="button-send-screenshot"
            >
              <Download className="h-5 w-5" />
              Send Screenshot
            </button>

            <button
              onClick={() => handleAction("replay")}
              className="w-full px-4 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover-elevate active-elevate-2 flex items-center justify-center gap-3"
              data-testid="button-replay-instructions"
            >
              <RotateCcw className="h-5 w-5" />
              Replay Instructions
            </button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
