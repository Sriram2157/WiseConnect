import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LargeButton } from "@/components/shared/large-button";
import { SpeakButton } from "@/components/shared/speak-button";
import { DailyChallenge } from "@/components/home/daily-challenge";
import { useUser } from "@/lib/user-context";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Shield, 
  Award,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import type { LessonWithProgress } from "@shared/schema";

export default function HomePage() {
  const { user, isLoggedIn } = useUser();

  const { data: lessons } = useQuery<LessonWithProgress[]>({
    queryKey: [`/api/lessons?userId=${user.id}`],
    enabled: isLoggedIn && user.quizCompleted,
  });

  const { data: progressStats } = useQuery<{ completed: number; total: number; percentage: number }>({
    queryKey: [`/api/progress/stats?userId=${user.id}`],
    enabled: isLoggedIn && user.quizCompleted,
  });

  const welcomeText = isLoggedIn && user.quizCompleted
    ? `Welcome back, ${user.name}! Ready to continue your learning journey?`
    : "Welcome to WiseConnect! Learn technology at your own pace with simple, step-by-step lessons.";

  const currentLesson = lessons?.find(l => l.progress && !l.progress.completed);
  const completedLessons = lessons?.filter(l => l.progress?.completed).length || 0;

  if (!isLoggedIn || !user.quizCompleted) {
    return <WelcomeSection />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-10">
      <div className="flex items-start justify-between gap-4 animate-fade-in-down">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up" data-testid="text-welcome">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Ready to continue your learning journey?
          </p>
        </div>
        <SpeakButton text={welcomeText} />
      </div>

      <DailyChallenge />

      {progressStats && (
        <Card className="border-2 card-hover animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {progressStats.completed} of {progressStats.total} lessons
                  </p>
                  <p className="text-lg text-muted-foreground">completed</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {progressStats.percentage}%
              </div>
            </div>
            <Progress value={progressStats.percentage} className="h-4" />
          </CardContent>
        </Card>
      )}

      {currentLesson && (
        <Card className="border-2 border-primary/30 bg-primary/5 card-hover animate-fade-in-up animate-glow" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg font-semibold">Continue Learning</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {currentLesson.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentLesson.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-lg">
                Step {currentLesson.progress?.currentStep || 1} of {currentLesson.totalSteps}
              </span>
              <span className="text-lg">
                {currentLesson.estimatedMinutes} min remaining
              </span>
            </div>
            <Link href={`/lessons/${currentLesson.id}`}>
              <LargeButton 
                icon={<ArrowRight className="h-6 w-6" />}
                iconPosition="right"
                data-testid="button-continue-learning"
              >
                Continue Learning
              </LargeButton>
            </Link>
          </CardContent>
        </Card>
      )}

      {!currentLesson && completedLessons > 0 && completedLessons === lessons?.length && (
        <Card className="border-2 border-success/30 bg-success/5 card-hover animate-fade-in-up animate-bounce-subtle" style={{ animationDelay: '300ms' }}>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Congratulations!
            </h2>
            <p className="text-xl text-muted-foreground">
              You've completed all available lessons. Great job!
            </p>
            <Link href="/community">
              <LargeButton 
                variant="secondary"
                icon={<Users className="h-6 w-6" />}
                data-testid="button-visit-community"
              >
                Visit Community
              </LargeButton>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/lessons">
          <Card className="border-2 card-hover cursor-pointer h-full animate-fade-in-up animate-stagger-enter" style={{ animationDelay: '400ms' }} data-testid="card-lessons-shortcut">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-9 w-9 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  View All Lessons
                </h3>
                <p className="text-lg text-muted-foreground">
                  Browse and start any lesson
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/community">
          <Card className="border-2 card-hover cursor-pointer h-full animate-fade-in-up animate-stagger-enter" style={{ animationDelay: '480ms' }} data-testid="card-community-shortcut">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
                <Users className="h-9 w-9 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Community Support
                </h3>
                <p className="text-lg text-muted-foreground">
                  Ask questions and share tips
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-2 border-warning/30 bg-warning/5">
        <CardContent className="pt-6 pb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20 flex-shrink-0">
            <Shield className="h-7 w-7 text-warning-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Stay Safe Online
            </h3>
            <p className="text-base text-muted-foreground">
              Visit your Profile to learn about online safety tips and scam prevention.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WelcomeSection() {
  const welcomeText = "Welcome to WiseConnect! We help you learn technology with confidence. Our lessons are simple, clear, and designed just for you. Let's get started with a quick quiz to personalize your learning experience.";

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome to WiseConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Learn technology with confidence. Simple, step-by-step lessons designed just for you.
          </p>
        </div>
        <SpeakButton text={welcomeText} />
      </div>

      <Card className="border-2 border-primary/30">
        <CardContent className="pt-10 pb-10 text-center space-y-8">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
              <Sparkles className="h-14 w-14 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Let's Get Started!
            </h2>
            <p className="text-xl text-muted-foreground">
              Take a quick quiz so we can personalize your learning experience. 
              It only takes 2 minutes.
            </p>
          </div>

          <Link href="/quiz">
            <LargeButton 
              icon={<ArrowRight className="h-6 w-6" />}
              iconPosition="right"
              data-testid="button-start-quiz"
            >
              Start Quiz
            </LargeButton>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              About WiseConnect
            </h2>
            <p className="text-lg text-foreground leading-relaxed">
              WiseConnect was created with a mission: to help older adults like you master technology with confidence. In today's world, digital skills are essential for staying connected with loved ones, managing your health, and accessing services you need.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              We believe that age is no barrier to learning. Our lessons are designed to be simple, clear, and encouraging—taking as much time as you need, with no judgment. We're here to empower you to thrive in our digital age.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground text-center">
          What You'll Learn
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard 
            icon={<BookOpen className="h-8 w-8" />}
            title="Email Basics"
            description="Set up and use email like a pro"
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8" />}
            title="Video Calls"
            description="Connect with family and friends"
          />
          <FeatureCard 
            icon={<Shield className="h-8 w-8" />}
            title="Stay Safe"
            description="Protect yourself online"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="border-2">
      <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
