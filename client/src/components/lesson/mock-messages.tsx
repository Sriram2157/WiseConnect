import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LargeButton } from "@/components/shared/large-button";
import { Send, User } from "lucide-react";

const mockContacts = ["Mom", "Dad", "Sister", "Friend"];

interface Message {
  id: string;
  sender: "user" | "contact";
  text: string;
}

export function MockMessages() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "contact", text: "Hi! How are you?" },
    { id: "2", sender: "user", text: "I'm doing great!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), sender: "user", text: newMessage },
      ]);
      setNewMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), sender: "contact", text: "That's wonderful!" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mockContacts.map((contact) => (
              <button
                key={contact}
                onClick={() => setSelectedContact(contact)}
                className={`px-4 py-2 rounded-full text-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedContact === contact
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover-elevate"
                }`}
                data-testid={`button-contact-${contact}`}
              >
                {contact}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 h-64 overflow-y-auto">
        <CardContent className="pt-6 pb-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          className="flex-1 px-4 py-3 text-lg border-2 border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="input-message"
        />
        <LargeButton
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          icon={<Send className="h-6 w-6" />}
          className="px-6"
          data-testid="button-send-message"
        >
          Send
        </LargeButton>
      </div>
    </div>
  );
}
