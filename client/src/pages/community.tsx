import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LargeButton } from "@/components/shared/large-button";
import { SpeakButton } from "@/components/shared/speak-button";
import { useUser } from "@/lib/user-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  HelpCircle, 
  Lightbulb, 
  MessageCircle,
  Clock,
  User,
  Send,
  Lock
} from "lucide-react";
import type { CommunityPost } from "@shared/schema";
import { Link } from "wouter";

const categories = [
  { id: "all", label: "All Posts", icon: MessageCircle },
  { id: "need_help", label: "Need Help", icon: HelpCircle },
  { id: "learning_tips", label: "Learning Tips", icon: Lightbulb },
  { id: "general_questions", label: "General Questions", icon: MessageCircle },
];

export default function CommunityPage() {
  const { user, isLoggedIn } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<CommunityPost[]>({
    queryKey: [`/api/community/posts?category=${selectedCategory}`],
  });

  const pageDescription = "Welcome to the WiseConnect community! Here you can ask questions, share learning tips, and connect with other learners.";

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
                Join Our Community
              </h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Complete the onboarding quiz to access the community and connect with other learners.
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

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 pb-28 md:pb-12 space-y-8">
      <div className="flex items-start justify-between gap-4 animate-fade-in-down">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up">
            Community
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Ask questions and share tips with fellow learners
          </p>
        </div>
        <SpeakButton text={pageDescription} />
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              className="h-14 px-6 text-lg gap-3"
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`filter-${category.id}`}
            >
              <Icon className="h-5 w-5" />
              {category.label}
            </Button>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <LargeButton
            icon={<Plus className="h-6 w-6" />}
            className="w-full md:w-auto"
            data-testid="button-ask-question"
          >
            Ask a Question
          </LargeButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
          </DialogHeader>
          <NewPostForm 
            userId={user.id!} 
            userName={user.name}
            onSuccess={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <MessageCircle className="h-9 w-9 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                No posts yet
              </h3>
              <p className="text-lg text-muted-foreground">
                Be the first to ask a question or share a tip!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const categoryInfo = categories.find((c) => c.id === post.category);
  const CategoryIcon = categoryInfo?.icon || MessageCircle;
  
  const categoryColors: Record<string, string> = {
    need_help: "bg-destructive/10 text-destructive border-destructive/20",
    learning_tips: "bg-success/10 text-success border-success/20",
    general_questions: "bg-primary/10 text-primary border-primary/20",
  };

  const timeAgo = getTimeAgo(new Date(post.createdAt || Date.now()));

  return (
    <Card className="border-2 card-hover animate-fade-in-up animate-stagger-enter">
      <CardContent className="pt-8 pb-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{post.userName}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-base">{timeAgo}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`px-4 py-2 text-base gap-2 ${categoryColors[post.category]}`}
          >
            <CategoryIcon className="h-4 w-4" />
            {categoryInfo?.label || post.category}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{post.title}</h3>
          <p className="text-lg text-muted-foreground line-clamp-3">{post.content}</p>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
          <span className="text-lg">{post.repliesCount || 0} replies</span>
        </div>
      </CardContent>
    </Card>
  );
}

function NewPostForm({ 
  userId, 
  userName,
  onSuccess 
}: { 
  userId: string; 
  userName: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general_questions");

  const createPostMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; category: string }) => {
      await apiRequest("POST", "/api/community/posts", {
        ...data,
        userId,
        userName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Question Posted!",
        description: "Your question has been shared with the community.",
      });
      setTitle("");
      setContent("");
      setCategory("general_questions");
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createPostMutation.mutate({ title: title.trim(), content: content.trim(), category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="category" className="text-lg font-medium">
          Category
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            
            return (
              <Button
                key={cat.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className="h-12 px-4 text-base gap-2"
                onClick={() => setCategory(cat.id)}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="title" className="text-lg font-medium">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What would you like to ask?"
          className="h-14 text-lg px-4"
          data-testid="input-post-title"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="content" className="text-lg font-medium">
          Details
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question or tip in detail..."
          className="min-h-[120px] text-lg px-4 py-3"
          data-testid="input-post-content"
        />
      </div>

      <LargeButton
        type="submit"
        loading={createPostMutation.isPending}
        disabled={!title.trim() || !content.trim()}
        icon={<Send className="h-5 w-5" />}
        data-testid="button-submit-post"
      >
        Post Question
      </LargeButton>
    </form>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}
