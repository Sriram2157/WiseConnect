import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container max-w-2xl mx-auto px-6 py-12">
      <Card className="border-2">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              We couldn't find the page you're looking for. Let's get you back on track.
            </p>
          </div>

          <Link href="/">
            <LargeButton icon={<Home className="h-6 w-6" />} data-testid="button-go-home">
              Go to Home
            </LargeButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
