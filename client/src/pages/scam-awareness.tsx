import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { ScamAwareness } from "@/components/lesson/scam-awareness";
import { ArrowLeft } from "lucide-react";

export default function ScamAwarenessPage() {
  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="h-12 w-12 rounded-lg border-2 border-border hover-elevate flex items-center justify-center" data-testid="button-back-scams">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Stay Safe Online
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn to spot and avoid common scams
          </p>
        </div>
      </div>

      <ScamAwareness />

      <Card className="border-2 border-success/30 bg-success/5">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">You're Ready!</h2>
          <p className="text-lg text-foreground">
            You now have the knowledge to protect yourself online. Trust your instincts and stay safe.
          </p>
          <Link href="/">
            <LargeButton data-testid="button-home-scams">
              Go Home
            </LargeButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
