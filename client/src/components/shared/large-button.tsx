import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LargeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
  "data-testid"?: string;
}

export function LargeButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  "data-testid": testId,
}: LargeButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`h-16 min-h-[64px] px-8 text-xl font-semibold gap-4 rounded-xl w-full md:w-auto md:min-w-[280px] ${className}`}
      data-testid={testId}
    >
      {loading ? (
        <Loader2 className="h-7 w-7 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </Button>
  );
}
