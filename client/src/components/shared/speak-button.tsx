import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/lib/accessibility-context";
import { useId, useEffect } from "react";

interface SpeakButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function SpeakButton({ text, className = "", size = "default" }: SpeakButtonProps) {
  const instanceId = useId();
  const { speak, stopSpeaking, isSpeaking, currentSpeakingId, speechSupported } = useAccessibility();

  const isThisSpeaking = isSpeaking && currentSpeakingId === instanceId;

  useEffect(() => {
    return () => {
      if (currentSpeakingId === instanceId) {
        stopSpeaking(instanceId);
      }
    };
  }, [instanceId, currentSpeakingId, stopSpeaking]);

  const handleClick = () => {
    if (isThisSpeaking) {
      stopSpeaking(instanceId);
    } else {
      speak(text, instanceId);
    }
  };

  const sizeClasses = {
    sm: "h-[60px] w-[60px]",
    default: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    default: "h-7 w-7",
    lg: "h-8 w-8",
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={`rounded-full border-2 flex-shrink-0 ${sizeClasses[size]} ${className}`}
      data-testid={`button-speak-${instanceId.replace(/:/g, '')}`}
      aria-label={isThisSpeaking ? "Stop reading aloud" : "Read aloud"}
    >
      {isThisSpeaking ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </Button>
  );
}
