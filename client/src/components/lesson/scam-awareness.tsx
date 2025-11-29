import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LargeButton } from "@/components/shared/large-button";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

const scamExamples = [
  {
    id: "phishing",
    title: "Phishing Email",
    description: "Fake email pretending to be from your bank asking you to verify your password",
    redFlags: ["Urgent language", "Asks for password", "Generic greeting", "Suspicious links"],
  },
  {
    id: "lottery",
    title: "Prize Scam",
    description: "You've won a lottery you never entered! Click here to claim your prize",
    redFlags: ["Unsolicited prize", "Too good to be true", "Asks for personal info", "Unknown sender"],
  },
  {
    id: "support",
    title: "Tech Support Scam",
    description: "Pop-up saying your device has a virus and to call a number for help",
    redFlags: ["Unexpected pop-ups", "Threatening language", "Phone number", "Fake warnings"],
  },
];

export function ScamAwareness() {
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleAnswer = (id: string, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: isCorrect }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-warning" />
          Scam Awareness
        </h2>
        <p className="text-xl text-muted-foreground">
          Learn how to identify and avoid common online scams
        </p>
      </div>

      <div className="space-y-4">
        {scamExamples.map((example) => (
          <Card
            key={example.id}
            className={`border-2 card-hover cursor-pointer ${
              selected === example.id ? "border-warning/50 bg-warning/10" : "border-warning/20"
            }`}
            onClick={() => setSelected(example.id)}
            data-testid={`card-scam-${example.id}`}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-7 w-7 text-warning flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{example.title}</h3>
                  <p className="text-lg text-muted-foreground mb-4">{example.description}</p>

                  {selected === example.id && (
                    <div className="space-y-3 mt-4 p-4 bg-background rounded-lg border-2 border-warning/20 animate-slideInUp">
                      <p className="text-lg font-semibold text-foreground">Red Flags:</p>
                      <ul className="space-y-2">
                        {example.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-lg text-foreground">
                            <div className="h-2 w-2 rounded-full bg-warning" />
                            {flag}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleAnswer(example.id, true);
                          }}
                          className="h-14 px-6 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover-elevate active-elevate-2 flex items-center justify-center gap-3"
                          data-testid={`button-understand-${example.id}`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          I Understand
                        </button>
                      </div>

                      {answers[example.id] && (
                        <div className="flex items-center gap-2 p-3 bg-success/20 border-2 border-success rounded-lg animate-fadeIn">
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                          <span className="text-lg font-semibold text-success">Great! You learned about this scam</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-success/30 bg-success/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-7 w-7 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Safety Tips</h3>
              <ul className="space-y-2 text-lg text-foreground">
                <li>• Never share passwords or personal information via email</li>
                <li>• If something seems too good to be true, it probably is</li>
                <li>• Verify requests by calling official numbers from official websites</li>
                <li>• When in doubt, ask a trusted friend or family member</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
