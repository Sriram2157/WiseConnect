import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { UserProvider } from "@/lib/user-context";
import { TopNavigation, BottomNavigation } from "@/components/layout/navigation";
import HomePage from "@/pages/home";
import QuizPage from "@/pages/quiz";
import LessonsPage from "@/pages/lessons";
import LessonDetailPage from "@/pages/lesson-detail";
import CommunityPage from "@/pages/community";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/lessons" component={LessonsPage} />
      <Route path="/lessons/:id" component={LessonDetailPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <UserProvider>
            <div className="min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">
              <TopNavigation />
              <main className="pb-28 md:pb-0 w-full max-w-full overflow-x-hidden">
                <Router />
              </main>
              <BottomNavigation />
            </div>
            <Toaster />
          </UserProvider>
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
