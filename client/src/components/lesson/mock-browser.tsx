import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Home, Search } from "lucide-react";

const mockPages = {
  home: {
    title: "Homepage",
    content: "Welcome to the Web Browser Demo. This is a simple mock browser to help you learn.",
  },
  search: {
    title: "Search Results",
    content: "Results for 'How to stay healthy': 10 Easy Tips for Staying Healthy...",
  },
  news: {
    title: "Tech News Today",
    content: "Breaking News: New Technology Makes Life Easier. Read about the latest innovations...",
  },
};

type PageKey = keyof typeof mockPages;

export function MockBrowser() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [url, setUrl] = useState("www.example.com");
  const [canGoBack, setCanGoBack] = useState(false);
  const [history, setHistory] = useState<PageKey[]>(["home"]);

  const handleNavigation = (page: PageKey) => {
    setHistory([...history, page]);
    setCurrentPage(page);
    setCanGoBack(true);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
      setCanGoBack(newHistory.length > 1);
    }
  };

  const handleHome = () => {
    setCurrentPage("home");
    setHistory(["home"]);
    setCanGoBack(false);
    setUrl("www.example.com");
  };

  const page = mockPages[currentPage];

  return (
    <Card className="border-2">
      <CardContent className="pt-6 pb-6 space-y-4">
        <div className="flex gap-2 items-center bg-muted p-2 rounded-xl">
          <button
            onClick={handleGoBack}
            disabled={!canGoBack}
            className="h-10 w-10 rounded-lg bg-background border-2 border-border flex items-center justify-center disabled:opacity-50 hover-elevate"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            className="h-10 w-10 rounded-lg bg-background border-2 border-border flex items-center justify-center hover-elevate"
            data-testid="button-forward"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={handleHome}
            className="h-10 w-10 rounded-lg bg-background border-2 border-border flex items-center justify-center hover-elevate"
            data-testid="button-home"
          >
            <Home className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-base border-2 border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="input-address-bar"
          />
        </div>

        <div className="border-2 border-border rounded-xl bg-background p-6 h-64 overflow-y-auto space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{page.title}</h2>
          <p className="text-lg text-foreground leading-relaxed">{page.content}</p>
          <div className="pt-4 space-y-3">
            {Object.entries(mockPages).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleNavigation(key as PageKey)}
                className="w-full text-left px-4 py-3 bg-primary/10 border-2 border-primary rounded-lg text-lg font-semibold text-primary hover-elevate"
                data-testid={`link-${key}`}
              >
                → {value.title}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
