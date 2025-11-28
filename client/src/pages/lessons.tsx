import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeakButton } from "@/components/shared/speak-button";
import { useUser } from "@/lib/user-context";
import { 
  Mail, 
  Video, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  BookOpen,
  Lock
} from "lucide-react";
import type { LessonWithProgress } from "@shared/schema";

const iconMap: Record<string, typeof Mail> = {
  mail: Mail,
  video: Video,
  smartphone: Smartphone,
};

export default function LessonsPage() {
  const { user, isLoggedIn } = useUser();

  const { data: lessons, isLoading } = useQuery<LessonWithProgress[]>({
    queryKey: [`/api/lessons?userId=${user.id}`],
    enabled: isLoggedIn && user.quizCompleted,
  });

  const pageDescription = "Browse all available lessons. Each lesson is designed to be simple and easy to follow at your own pace.";

  if (!isLoggedIn || !user.quizCompleted) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Complete the Quiz First
              </h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Take our quick quiz to unlock personalized lessons tailored to your learning style.
              </p>
            </div>
            <Link href="/quiz">
              <button className="h-16 px-8 text-xl font-semibold rounded-xl bg-primary text-primary-foreground hover-elevate inline-flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                Take the Quiz
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-6">
        <div className="h-12 w-64 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <div className="flex items-start justify-between gap-4 animate-fade-in-down">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up">
            Your Lessons
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Learn at your own pace with step-by-step guidance
          </p>
        </div>
        <SpeakButton text={pageDescription} />
      </div>

      <div className="space-y-6">
        {lessons?.map((lesson, index) => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson}
            number={index + 1}
          />
        ))}
      </div>

      {lessons?.length === 0 && (
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-xl text-muted-foreground">
              No lessons available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LessonCard({ lesson, number }: { lesson: LessonWithProgress; number: number }) {
  const Icon = iconMap[lesson.iconName] || BookOpen;
  const isCompleted = lesson.progress?.completed;
  const isStarted = lesson.progress && lesson.progress.currentStep > 0;
  const progressPercentage = lesson.progress
    ? Math.round((lesson.progress.currentStep / lesson.totalSteps) * 100)
    : 0;

  const difficultyColors: Record<string, string> = {
    beginner: "bg-success/10 text-success border-success/20",
    intermediate: "bg-warning/10 text-warning-foreground border-warning/20",
    advanced: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Link href={`/lessons/${lesson.id}`}>
      <Card 
        className={`border-2 card-hover cursor-pointer animate-fade-in-up animate-stagger-enter ${
          isCompleted ? "border-success/30 bg-success/5" : ""
        }`}
        data-testid={`card-lesson-${lesson.id}`}
      >
        <CardContent className="pt-8 pb-8">
          <div className="flex gap-6">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 ${
              isCompleted 
                ? "bg-success/20" 
                : "bg-primary/10"
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="h-9 w-9 text-success" />
              ) : (
                <Icon className="h-9 w-9 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-medium text-muted-foreground">
                      Lesson {number}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 text-sm ${difficultyColors[lesson.difficulty]}`}
                    >
                      {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {lesson.title}
                  </h2>
                </div>
                <ArrowRight className="h-7 w-7 text-muted-foreground flex-shrink-0 mt-1" />
              </div>

              <p className="text-lg text-muted-foreground line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">{lesson.estimatedMinutes} min</span>
                  </div>
                  <span className="text-lg">
                    {lesson.totalSteps} steps
                  </span>
                </div>

                {isStarted && !isCompleted && (
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <Progress value={progressPercentage} className="h-3 flex-1" />
                    <span className="text-lg font-medium text-foreground">
                      {progressPercentage}%
                    </span>
                  </div>
                )}

                {isCompleted && (
                  <Badge className="bg-success text-success-foreground px-4 py-2 text-base">
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
