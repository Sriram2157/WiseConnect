import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { CheckCircle2, Zap } from "lucide-react";

const challenges = [
  "Send an email to a friend",
  "Make a video call using a practice interface",
  "Search for something on the practice browser",
  "Take a photo using the practice camera",
  "Send a text message to family",
];

export function DailyChallenge() {
  const [completed, setCompleted] = useState(false);
  const [currentDay] = useState(() => Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % challenges.length);

  const challenge = challenges[currentDay];

  const handleComplete = () => {
    setCompleted(true);
    confetti();
    setTimeout(() => setCompleted(false), 3000);
  };

  return (
    <Card className={`border-2 ${completed ? "border-success/30 bg-success/5" : "border-primary/20"}`}>
      <CardContent className="pt-8 pb-8 space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 text-warning" />
          <h3 className="text-2xl font-bold text-foreground">Daily Challenge</h3>
        </div>

        <div className="space-y-3 p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
          <p className="text-lg text-foreground font-medium">Today's task:</p>
          <p className="text-xl text-foreground font-semibold">{challenge}</p>
        </div>

        <div className="text-center">
          <LargeButton
            onClick={handleComplete}
            disabled={completed}
            icon={completed ? <CheckCircle2 className="h-6 w-6" /> : undefined}
            data-testid="button-complete-challenge"
          >
            {completed ? "Challenge Complete! 🎉" : "Mark as Complete"}
          </LargeButton>
        </div>
      </CardContent>
    </Card>
  );
}

function confetti() {
  if (typeof window !== "undefined" && "confetti" in window) {
    (window.confetti as any)();
  }
}
