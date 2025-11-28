import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { SpeakButton } from "@/components/shared/speak-button";
import { ProgressIndicator } from "@/components/shared/progress-indicator";
import { useUser } from "@/lib/user-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Award
} from "lucide-react";
import type { Lesson, LessonStep, UserProgress } from "@shared/schema";

interface LessonData {
  lesson: Lesson;
  steps: LessonStep[];
  progress: UserProgress | null;
}

export default function LessonDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isLoggedIn } = useUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);

  const { data, isLoading } = useQuery<LessonData>({
    queryKey: [`/api/lessons/${params.id}?userId=${user.id}`],
    enabled: isLoggedIn && !!params.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (step: number) => {
      await apiRequest("POST", `/api/lessons/${params.id}/progress`, {
        userId: user.id,
        currentStep: step,
        completed: step > (data?.lesson.totalSteps || 0),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  useEffect(() => {
    if (data?.progress?.currentStep) {
      setCurrentStep(data.progress.currentStep);
    }
  }, [data?.progress?.currentStep]);

  const handleNext = () => {
    if (data && currentStep < data.lesson.totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateProgressMutation.mutate(nextStep);
    } else if (data && currentStep === data.lesson.totalSteps) {
      updateProgressMutation.mutate(currentStep + 1);
      setShowCompletion(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!isLoggedIn || !user.quizCompleted) {
    return (
      <div className="container max-w-3xl mx-auto px-6 py-8 pb-28 md:pb-12">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <p className="text-xl text-muted-foreground">
              Please complete the quiz first to access lessons.
            </p>
            <Link href="/quiz">
              <LargeButton data-testid="button-go-quiz">Take the Quiz</LargeButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-6">
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-12 w-3/4 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 w-full bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container max-w-3xl mx-auto px-6 py-8 pb-28 md:pb-12">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <p className="text-xl text-muted-foreground">
              Lesson not found.
            </p>
            <Link href="/lessons">
              <LargeButton variant="outline" data-testid="button-back-lessons">
                Back to Lessons
              </LargeButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCompletion) {
    return <CompletionScreen lessonTitle={data.lesson.title} onGoHome={handleGoHome} />;
  }

  const currentStepData = data.steps.find((s) => s.stepNumber === currentStep);
  const isLastStep = currentStep === data.lesson.totalSteps;

  return (
    <div className="container max-w-3xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-6">
      <ProgressIndicator
        current={currentStep}
        total={data.lesson.totalSteps}
        showSteps
        label={data.lesson.title}
      />

      {currentStepData && (
        <StepContent 
          step={currentStepData} 
          isLast={isLastStep}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 bg-background border-t-2 md:border-0 border-border p-4 md:p-0">
        <div className="container max-w-3xl mx-auto flex gap-4 justify-between">
          <LargeButton
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            icon={<ArrowLeft className="h-6 w-6" />}
            data-testid="button-previous"
          >
            Previous
          </LargeButton>

          <LargeButton
            onClick={handleNext}
            loading={updateProgressMutation.isPending}
            icon={isLastStep ? <CheckCircle2 className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
            iconPosition="right"
            data-testid="button-next"
          >
            {isLastStep ? "Complete Lesson" : "Next"}
          </LargeButton>
        </div>
      </div>
    </div>
  );
}

function StepContent({ step, isLast }: { step: LessonStep; isLast: boolean }) {
  const speakText = `${step.title}. ${step.content}${step.tipText ? `. Tip: ${step.tipText}` : ""}`;

  return (
    <Card className="border-2">
      <CardContent className="pt-10 pb-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {step.title}
          </h2>
          <SpeakButton text={speakText} />
        </div>

        {step.imagePlaceholder && (
          <div className="relative aspect-video w-full max-w-lg mx-auto rounded-2xl bg-muted border-4 border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 p-6">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-lg text-muted-foreground">
                  {step.imagePlaceholder}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-foreground whitespace-pre-line">
            {step.content}
          </p>
        </div>

        {step.tipText && (
          <div className="flex gap-4 p-6 rounded-xl bg-accent/30 border-2 border-accent">
            <Lightbulb className="h-7 w-7 text-accent-foreground flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">Helpful Tip</p>
              <p className="text-lg text-muted-foreground">{step.tipText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CompletionScreen({ 
  lessonTitle, 
  onGoHome 
}: { 
  lessonTitle: string; 
  onGoHome: () => void;
}) {
  const speakText = `Congratulations! You have completed the lesson: ${lessonTitle}. Great job! You're making wonderful progress in your learning journey.`;

  return (
    <div className="container max-w-3xl mx-auto px-6 py-8 pb-28 md:pb-12">
      <Card className="border-2 border-success/30 bg-success/5">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-success/20">
              <Award className="h-16 w-16 text-success" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Congratulations!
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              You've completed <span className="font-semibold text-foreground">{lessonTitle}</span>
            </p>
          </div>

          <SpeakButton text={speakText} size="lg" className="mx-auto" />

          <p className="text-xl text-muted-foreground">
            Great job! You're making wonderful progress in your learning journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/lessons">
              <LargeButton 
                variant="outline"
                icon={<BookOpen className="h-6 w-6" />}
                data-testid="button-more-lessons"
              >
                More Lessons
              </LargeButton>
            </Link>
            <LargeButton 
              onClick={onGoHome}
              icon={<Home className="h-6 w-6" />}
              data-testid="button-go-home"
            >
              Go Home
            </LargeButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
