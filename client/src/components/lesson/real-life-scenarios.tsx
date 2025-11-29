import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LargeButton } from "@/components/shared/large-button";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

const scenarios = [
  {
    id: "appointment",
    title: "Book a Doctor Appointment",
    description: "Learn how to schedule a medical appointment online",
    steps: 4,
    icon: "📅",
  },
  {
    id: "scam",
    title: "Spot an Online Scam",
    description: "Identify common scams and protect yourself",
    steps: 3,
    icon: "⚠️",
  },
  {
    id: "bill",
    title: "Pay a Bill Online",
    description: "Safely pay your utilities and bills using your computer",
    steps: 5,
    icon: "💳",
  },
  {
    id: "message",
    title: "Send a Message to Family",
    description: "Connect with loved ones through messaging apps",
    steps: 3,
    icon: "💬",
  },
];

export function RealLifeScenarios() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Real-World Tasks</h2>
        <p className="text-lg text-muted-foreground">Learn practical skills you can use every day</p>
      </div>

      <div className="grid gap-4">
        {scenarios.map((scenario) => {
          const isComplete = completed.includes(scenario.id);
          return (
            <Card
              key={scenario.id}
              className={`border-2 card-hover cursor-pointer ${
                isComplete ? "border-success/30 bg-success/5" : "border-primary/20"
              }`}
              data-testid={`card-scenario-${scenario.id}`}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">{scenario.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{scenario.title}</h3>
                      {isComplete && <CheckCircle2 className="h-7 w-7 text-success flex-shrink-0" />}
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">{scenario.description}</p>
                    <Badge variant="outline" className="text-base px-3 py-1 mb-4">
                      {scenario.steps} steps
                    </Badge>
                    <LargeButton
                      variant={isComplete ? "outline" : "default"}
                      onClick={() => toggleComplete(scenario.id)}
                      icon={isComplete ? <CheckCircle2 className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                      iconPosition={isComplete ? undefined : "right"}
                      data-testid={`button-scenario-${scenario.id}`}
                    >
                      {isComplete ? "Completed" : "Start Learning"}
                    </LargeButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
