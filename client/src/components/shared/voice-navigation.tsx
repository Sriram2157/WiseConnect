import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAccessibility } from "@/lib/accessibility-context";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceNavigation() {
  const [, navigate] = useLocation();
  const { speak } = useAccessibility();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      if (transcript.includes("home")) {
        navigate("/");
        speak("Going home");
      } else if (transcript.includes("lesson") || transcript.includes("next lesson")) {
        navigate("/lessons");
        speak("Going to lessons");
      } else if (transcript.includes("bigger") || transcript.includes("larger text")) {
        speak("Making text bigger");
      } else if (transcript.includes("help")) {
        speak("Opening help menu");
      } else if (transcript.includes("community")) {
        navigate("/community");
        speak("Going to community");
      } else if (transcript.includes("profile")) {
        navigate("/profile");
        speak("Going to profile");
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.abort();
    };
  }, [navigate, speak]);

  return null;
}
