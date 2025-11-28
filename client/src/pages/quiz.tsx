import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LargeButton } from "@/components/shared/large-button";
import { SpeakButton } from "@/components/shared/speak-button";
import { StepDots } from "@/components/shared/progress-indicator";
import { useUser } from "@/lib/user-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { QuizQuestionWithOptions } from "@shared/schema";

interface QuizAnswer {
  questionId: string;
  selectedValue: string;
}

export default function QuizPage() {
  const [, navigate] = useLocation();
  const { setUser } = useUser();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const { data: questions, isLoading } = useQuery<QuizQuestionWithOptions[]>({
    queryKey: ["/api/quiz/questions"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { userName: string; answers: QuizAnswer[] }) => {
      const response = await apiRequest("POST", "/api/quiz/submit", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser({
        id: data.userId,
        name: data.name,
        quizCompleted: true,
        digitalLiteracyLevel: data.digitalLiteracyLevel,
        learningStyle: data.learningStyle,
      });
      queryClient.invalidateQueries();
      navigate("/");
    },
  });

  const totalSteps = (questions?.length || 0) + 1;
  const isNameStep = currentStep === 0;
  const currentQuestion = questions?.[currentStep - 1];

  const handleNameSubmit = () => {
    if (userName.trim().length >= 2) {
      setCurrentStep(1);
    }
  };

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedValue: value };
        return updated;
      }
      return [...prev, { questionId, selectedValue: value }];
    });
  };

  const getSelectedValue = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId)?.selectedValue;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitMutation.mutate({ userName: userName.trim(), answers });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = isNameStep
    ? userName.trim().length >= 2
    : currentQuestion
    ? !!getSelectedValue(currentQuestion.id)
    : false;

  const isLastStep = currentStep === totalSteps - 1;

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-xl text-muted-foreground">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <StepDots current={currentStep + 1} total={totalSteps} />

      {isNameStep ? (
        <NameStep
          value={userName}
          onChange={setUserName}
          onSubmit={handleNameSubmit}
          canProceed={canProceed}
        />
      ) : currentQuestion ? (
        <QuestionStep
          question={currentQuestion}
          selectedValue={getSelectedValue(currentQuestion.id)}
          onSelect={(value) => handleSelectOption(currentQuestion.id, value)}
        />
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {currentStep > 0 && (
          <LargeButton
            variant="outline"
            onClick={handleBack}
            icon={<ArrowLeft className="h-6 w-6" />}
            data-testid="button-quiz-back"
          >
            Back
          </LargeButton>
        )}
        
        <LargeButton
          onClick={handleNext}
          disabled={!canProceed}
          loading={submitMutation.isPending}
          icon={isLastStep ? <CheckCircle2 className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
          iconPosition="right"
          className="ml-auto"
          data-testid="button-quiz-next"
        >
          {isLastStep ? "Finish Quiz" : "Next"}
        </LargeButton>
      </div>
    </div>
  );
}

function NameStep({
  value,
  onChange,
  onSubmit,
  canProceed,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  canProceed: boolean;
}) {
  const speakText = "Let's start by getting to know you. What should we call you? Please enter your first name.";

  return (
    <Card className="border-2">
      <CardContent className="pt-10 pb-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Let's get to know you
            </h1>
            <p className="text-xl text-muted-foreground">
              What should we call you?
            </p>
          </div>
          <SpeakButton text={speakText} />
        </div>

        <div className="space-y-4">
          <Label htmlFor="name" className="text-xl font-medium">
            Your First Name
          </Label>
          <Input
            id="name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canProceed) {
                onSubmit();
              }
            }}
            placeholder="Enter your name"
            className="h-16 text-xl px-6"
            data-testid="input-name"
          />
          <p className="text-lg text-muted-foreground">
            We'll use this to personalize your experience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionStep({
  question,
  selectedValue,
  onSelect,
}: {
  question: QuizQuestionWithOptions;
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
}) {
  const speakText = `${question.questionText}. Your options are: ${question.options
    .map((o) => o.optionText)
    .join(". ")}`;

  return (
    <Card className="border-2">
      <CardContent className="pt-10 pb-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {question.questionText}
          </h1>
          <SpeakButton text={speakText} />
        </div>

        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = selectedValue === option.value;
            
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.value)}
                className={`w-full min-h-[80px] p-6 text-left text-xl font-medium rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover-elevate"
                }`}
                data-testid={`option-${option.value}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>
                  <span>{option.optionText}</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
