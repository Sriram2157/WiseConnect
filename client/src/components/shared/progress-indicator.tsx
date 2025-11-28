import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showSteps?: boolean;
  label?: string;
}

export function ProgressIndicator({
  current,
  total,
  showPercentage = true,
  showSteps = false,
  label,
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);
  const isComplete = current >= total;

  return (
    <div className="w-full space-y-3">
      {(label || showPercentage || showSteps) && (
        <div className="flex items-center justify-between gap-4">
          {label && (
            <span className="text-lg font-medium text-foreground">{label}</span>
          )}
          <div className="flex items-center gap-4 ml-auto">
            {showSteps && (
              <span className="text-lg font-medium text-muted-foreground">
                Step {current} of {total}
              </span>
            )}
            {showPercentage && (
              <div className="flex items-center gap-2">
                {isComplete && (
                  <CheckCircle2 className="h-7 w-7 text-success" />
                )}
                <span className="text-2xl font-bold text-foreground">
                  {percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <Progress 
        value={percentage} 
        className="h-4 rounded-full"
      />
    </div>
  );
}

interface StepDotsProps {
  current: number;
  total: number;
}

export function StepDots({ current, total }: StepDotsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < current;
        const isCurrent = stepNumber === current;
        
        return (
          <div
            key={i}
            className={`h-5 w-5 rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-success"
                : isCurrent
                ? "bg-primary scale-125"
                : "bg-muted"
            }`}
            aria-label={`Step ${stepNumber} of ${total}${
              isCompleted ? " (completed)" : isCurrent ? " (current)" : ""
            }`}
          />
        );
      })}
    </div>
  );
}
