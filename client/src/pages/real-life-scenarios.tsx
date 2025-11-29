import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { RealLifeScenarios } from "@/components/lesson/real-life-scenarios";
import { ArrowLeft } from "lucide-react";

export default function RealLifeScenariosPage() {
  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="h-12 w-12 rounded-lg border-2 border-border hover-elevate flex items-center justify-center" data-testid="button-back-scenarios">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Real-World Tasks
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn practical skills you use every day
          </p>
        </div>
      </div>

      <RealLifeScenarios />

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-8 pb-8 text-center">
          <p className="text-lg text-foreground mb-4">
            Master these real-world tasks and become confident with technology in your daily life.
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
