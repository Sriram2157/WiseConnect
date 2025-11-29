import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { UserProvider } from "@/lib/user-context";
import { TopNavigation, BottomNavigation } from "@/components/layout/navigation";
import { ParticlesBackground } from "@/components/layout/particles-background";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { HeroBlob } from "@/components/layout/hero-blob";
import { BlobBackground } from "@/components/layout/blob-background";
import { SOSButton } from "@/components/lesson/sos-button";
import { VoiceNavigation } from "@/components/shared/voice-navigation";
import HomePage from "@/pages/home";
import QuizPage from "@/pages/quiz";
import LessonsPage from "@/pages/lessons";
import LessonDetailPage from "@/pages/lesson-detail";
import CommunityPage from "@/pages/community";
import ProfilePage from "@/pages/profile";
import RealLifeScenariosPage from "@/pages/real-life-scenarios";
import ScamAwarenessPage from "@/pages/scam-awareness";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PageWrapper><HomePage /></PageWrapper>} />
      <Route path="/quiz" component={() => <PageWrapper><QuizPage /></PageWrapper>} />
      <Route path="/lessons/:id" component={() => <PageWrapper><LessonDetailPage /></PageWrapper>} />
      <Route path="/lessons" component={() => <PageWrapper><LessonsPage /></PageWrapper>} />
      <Route path="/community" component={() => <PageWrapper><CommunityPage /></PageWrapper>} />
      <Route path="/profile" component={() => <PageWrapper><ProfilePage /></PageWrapper>} />
      <Route path="/real-life-scenarios" component={() => <PageWrapper><RealLifeScenariosPage /></PageWrapper>} />
      <Route path="/scam-awareness" component={() => <PageWrapper><ScamAwarenessPage /></PageWrapper>} />
      <Route component={() => <PageWrapper><NotFound /></PageWrapper>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <UserProvider>
            <VoiceNavigation />
            <ParticlesBackground />
            <BlobBackground />
            <HeroBlob />
            <div className="relative z-10 min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden">
              <TopNavigation />
              <main className="pb-28 md:pb-0 w-full max-w-full overflow-x-hidden">
                <Router />
              </main>
              <BottomNavigation />
              <SOSButton />
            </div>
            <Toaster />
          </UserProvider>
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
