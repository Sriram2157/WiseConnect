import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { CheckCircle2, Send } from "lucide-react";

export function MockEmail() {
  const [email, setEmail] = useState({ to: "", subject: "", body: "" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email.to && email.subject && email.body) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setEmail({ to: "", subject: "", body: "" });
    }
  };

  return (
    <Card className="border-2 bg-card">
      <CardContent className="pt-8 pb-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-lg font-semibold text-foreground block mb-2">
              To:
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email.to}
              onChange={(e) => setEmail({ ...email, to: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-email-to"
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-foreground block mb-2">
              Subject:
            </label>
            <input
              type="text"
              placeholder="Enter email subject"
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-email-subject"
            />
          </div>

          <div>
            <label className="text-lg font-semibold text-foreground block mb-2">
              Message:
            </label>
            <textarea
              placeholder="Type your message here..."
              value={email.body}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
              data-testid="input-email-body"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <LargeButton
            onClick={handleSend}
            disabled={!email.to || !email.subject || !email.body}
            icon={<Send className="h-6 w-6" />}
            iconPosition="right"
            data-testid="button-send-email"
          >
            Send Email
          </LargeButton>
        </div>

        {sent && (
          <div className="flex items-center justify-center gap-3 p-4 bg-success/20 border-2 border-success rounded-xl animate-fadeIn">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <span className="text-lg font-semibold text-success">Email sent successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
