import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";

type TextSize = "medium" | "large" | "extra-large";

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  spotlightMode: boolean;
  setSpotlightMode: (enabled: boolean) => void;
  guidedMode: boolean;
  setGuidedMode: (enabled: boolean) => void;
  speak: (text: string, id?: string) => void;
  stopSpeaking: (id?: string) => void;
  isSpeaking: boolean;
  currentSpeakingId: string | null;
  speechSupported: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const TEXT_SIZE_CLASSES: Record<TextSize, string> = {
  medium: "text-base",
  large: "text-lg",
  "extra-large": "text-xl",
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wiseconnect-text-size") as TextSize) || "medium";
    }
    return "medium";
  });

  const [highContrast, setHighContrastState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wiseconnect-high-contrast") === "true";
    }
    return false;
  });

  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wiseconnect-theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  const [spotlightMode, setSpotlightModeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wiseconnect-spotlight-mode") === "true";
    }
    return false;
  });

  const [guidedMode, setGuidedModeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wiseconnect-guided-mode") === "true";
    }
    return false;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    localStorage.setItem("wiseconnect-text-size", textSize);
    document.documentElement.setAttribute("data-text-size", textSize);
    
    const textSizeStyles: Record<TextSize, string> = {
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    document.documentElement.style.fontSize = textSizeStyles[textSize];
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem("wiseconnect-high-contrast", String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("wiseconnect-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("wiseconnect-spotlight-mode", String(spotlightMode));
    if (spotlightMode) {
      document.documentElement.classList.add("spotlight-mode");
      const handleMouseMove = (e: MouseEvent) => {
        document.documentElement.style.setProperty("--spotlight-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--spotlight-y", `${e.clientY}px`);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      document.documentElement.classList.remove("spotlight-mode");
    }
  }, [spotlightMode]);

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setHighContrastState(enabled);
  }, []);

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  }, []);

  const setSpotlightMode = useCallback((enabled: boolean) => {
    setSpotlightModeState(enabled);
  }, []);

  const setGuidedMode = useCallback((enabled: boolean) => {
    setGuidedModeState(enabled);
  }, []);

  const speak = useCallback((text: string, id?: string) => {
    if (!speechSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(id || null);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      utteranceRef.current = null;
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  const stopSpeaking = useCallback((id?: string) => {
    if (!speechSupported) return;
    
    if (!id || currentSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      utteranceRef.current = null;
    }
  }, [speechSupported, currentSpeakingId]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        theme,
        setTheme,
        spotlightMode,
        setSpotlightMode,
        guidedMode,
        setGuidedMode,
        speak,
        stopSpeaking,
        isSpeaking,
        currentSpeakingId,
        speechSupported,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

export { TEXT_SIZE_CLASSES };
