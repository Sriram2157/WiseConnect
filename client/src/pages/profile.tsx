import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LargeButton } from "@/components/shared/large-button";
import { SpeakButton } from "@/components/shared/speak-button";
import { useUser } from "@/lib/user-context";
import { useAccessibility } from "@/lib/accessibility-context";
import { 
  User, 
  Award, 
  BookOpen,
  Shield,
  AlertTriangle,
  Eye,
  Type,
  Volume2,
  Moon,
  Sun,
  LogOut,
  Lock,
  Lightbulb
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoggedIn, clearUser } = useUser();
  const { 
    textSize, 
    setTextSize, 
    highContrast, 
    setHighContrast,
    theme,
    setTheme,
    spotlightMode,
    setSpotlightMode,
    guidedMode,
    setGuidedMode
  } = useAccessibility();

  const { data: progressStats } = useQuery<{ completed: number; total: number; percentage: number }>({
    queryKey: [`/api/progress/stats?userId=${user.id}`],
    enabled: isLoggedIn && user.quizCompleted,
  });

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
                Complete Your Profile
              </h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Take our quick quiz to set up your profile and start learning.
              </p>
            </div>
            <Link href="/quiz">
              <LargeButton data-testid="button-take-quiz">
                Take the Quiz
              </LargeButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelLabels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const styleLabels: Record<string, string> = {
    visual: "Visual Learner",
    auditory: "Auditory Learner",
    mixed: "Mixed Learner",
  };

  const profileDescription = `Your profile, ${user.name}. You are a ${levelLabels[user.digitalLiteracyLevel || "beginner"]} and a ${styleLabels[user.learningStyle || "visual"]}. You have completed ${progressStats?.completed || 0} lessons.`;

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Profile
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your settings and view your progress
          </p>
        </div>
        <SpeakButton text={profileDescription} />
      </div>

      <Card className="border-2">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-4 py-2 text-base">
                  {levelLabels[user.digitalLiteracyLevel || "beginner"]}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base">
                  {styleLabels[user.learningStyle || "visual"]}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {progressStats && (
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Award className="h-6 w-6 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xl text-foreground">
                {progressStats.completed} of {progressStats.total} lessons completed
              </span>
              <span className="text-2xl font-bold text-primary">
                {progressStats.percentage}%
              </span>
            </div>
            <Progress value={progressStats.percentage} className="h-4" />
            <Link href="/lessons">
              <Button variant="outline" className="h-14 px-6 text-lg gap-3 mt-2">
                <BookOpen className="h-5 w-5" />
                View All Lessons
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Eye className="h-6 w-6 text-primary" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Type className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label className="text-lg font-medium">Text Size</Label>
                <p className="text-base text-muted-foreground">Choose your preferred text size</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(["medium", "large", "extra-large"] as const).map((size) => (
                <Button
                  key={size}
                  variant={textSize === size ? "default" : "outline"}
                  className="h-12 px-4 text-base"
                  onClick={() => setTextSize(size)}
                  data-testid={`button-text-${size}`}
                >
                  {size === "medium" ? "A" : size === "large" ? "A+" : "A++"}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {theme === "light" ? (
                <Sun className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Moon className="h-6 w-6 text-muted-foreground" />
              )}
              <div>
                <Label className="text-lg font-medium">Dark Mode</Label>
                <p className="text-base text-muted-foreground">Easier on your eyes in low light</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              data-testid="switch-dark-mode"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Volume2 className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label className="text-lg font-medium">Voice Instructions</Label>
                <p className="text-base text-muted-foreground">
                  Tap the speaker icon on any screen to hear instructions read aloud
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Lightbulb className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label className="text-lg font-medium">Guided Mode</Label>
                <p className="text-base text-muted-foreground">
                  Highlights buttons and shows helpful hints to guide you through tasks
                </p>
              </div>
            </div>
            <Switch
              checked={guidedMode}
              onCheckedChange={setGuidedMode}
              data-testid="switch-guided-mode"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-warning/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-warning-foreground" />
            Online Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SafetyTip
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Watch Out for Scams"
            description="Never share your passwords, bank details, or personal information with strangers online or over the phone."
          />
          <SafetyTip
            icon={<Shield className="h-6 w-6" />}
            title="Verify Before You Click"
            description="Be careful with links in emails or messages. When in doubt, go directly to the official website."
          />
          <SafetyTip
            icon={<Lock className="h-6 w-6" />}
            title="Use Strong Passwords"
            description="Create passwords that are hard to guess. Mix letters, numbers, and symbols."
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-destructive/20">
        <CardContent className="pt-6 pb-6">
          <Button
            variant="outline"
            className="h-14 px-6 text-lg gap-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => {
              clearUser();
              window.location.href = "/";
            }}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
            Start Over (Reset Progress)
          </Button>
          <p className="text-base text-muted-foreground mt-3">
            This will clear all your progress and quiz results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SafetyTip({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
