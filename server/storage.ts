import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  QuizQuestion,
  QuizOption,
  QuizQuestionWithOptions,
  Lesson,
  LessonStep,
  UserProgress,
  CommunityPost,
  CommunityReply,
  InsertCommunityPost,
  LessonWithProgress,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser & { id: string }): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Quiz
  getQuizQuestions(): Promise<QuizQuestionWithOptions[]>;

  // Lessons
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonSteps(lessonId: string): Promise<LessonStep[]>;
  getLessonsWithProgress(userId: string): Promise<LessonWithProgress[]>;

  // Progress
  getProgress(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  getAllProgress(userId: string): Promise<UserProgress[]>;
  updateProgress(
    userId: string,
    lessonId: string,
    currentStep: number,
    completed: boolean
  ): Promise<UserProgress>;
  getProgressStats(userId: string): Promise<{ completed: number; total: number; percentage: number }>;

  // Community
  getPosts(category?: string): Promise<CommunityPost[]>;
  getPost(id: string): Promise<CommunityPost | undefined>;
  createPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getReplies(postId: string): Promise<CommunityReply[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizQuestions: Map<string, QuizQuestion>;
  private quizOptions: Map<string, QuizOption>;
  private lessons: Map<string, Lesson>;
  private lessonSteps: Map<string, LessonStep>;
  private userProgress: Map<string, UserProgress>;
  private communityPosts: Map<string, CommunityPost>;
  private communityReplies: Map<string, CommunityReply>;

  constructor() {
    this.users = new Map();
    this.quizQuestions = new Map();
    this.quizOptions = new Map();
    this.lessons = new Map();
    this.lessonSteps = new Map();
    this.userProgress = new Map();
    this.communityPosts = new Map();
    this.communityReplies = new Map();

    this.seedData();
  }

  private seedData() {
    // Seed Quiz Questions
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        questionText: "How often do you use a computer or smartphone?",
        questionType: "literacy",
        orderIndex: 1,
      },
      {
        id: "q2",
        questionText: "Have you ever sent an email before?",
        questionType: "literacy",
        orderIndex: 2,
      },
      {
        id: "q3",
        questionText: "How comfortable are you with technology?",
        questionType: "literacy",
        orderIndex: 3,
      },
      {
        id: "q4",
        questionText: "How do you prefer to learn new things?",
        questionType: "learning_style",
        orderIndex: 4,
      },
    ];

    questions.forEach((q) => this.quizQuestions.set(q.id, q));

    // Seed Quiz Options
    const options: QuizOption[] = [
      // Q1 options
      { id: "o1a", questionId: "q1", optionText: "Never or rarely", value: "beginner", orderIndex: 1 },
      { id: "o1b", questionId: "q1", optionText: "A few times a week", value: "intermediate", orderIndex: 2 },
      { id: "o1c", questionId: "q1", optionText: "Every day", value: "advanced", orderIndex: 3 },
      // Q2 options
      { id: "o2a", questionId: "q2", optionText: "No, never", value: "beginner", orderIndex: 1 },
      { id: "o2b", questionId: "q2", optionText: "Yes, with help", value: "intermediate", orderIndex: 2 },
      { id: "o2c", questionId: "q2", optionText: "Yes, on my own", value: "advanced", orderIndex: 3 },
      // Q3 options
      { id: "o3a", questionId: "q3", optionText: "Not comfortable at all", value: "beginner", orderIndex: 1 },
      { id: "o3b", questionId: "q3", optionText: "Somewhat comfortable", value: "intermediate", orderIndex: 2 },
      { id: "o3c", questionId: "q3", optionText: "Very comfortable", value: "advanced", orderIndex: 3 },
      // Q4 options (learning style)
      { id: "o4a", questionId: "q4", optionText: "By watching videos or looking at pictures", value: "visual", orderIndex: 1 },
      { id: "o4b", questionId: "q4", optionText: "By listening to instructions", value: "auditory", orderIndex: 2 },
      { id: "o4c", questionId: "q4", optionText: "A mix of both", value: "mixed", orderIndex: 3 },
    ];

    options.forEach((o) => this.quizOptions.set(o.id, o));

    // Seed Lessons
    const lessonsData: Lesson[] = [
      {
        id: "lesson-email",
        title: "How to Set Up and Use Email",
        description: "Learn how to create an email account, write messages, and stay connected with family and friends.",
        iconName: "mail",
        orderIndex: 1,
        totalSteps: 5,
        difficulty: "beginner",
        estimatedMinutes: 15,
      },
      {
        id: "lesson-video-call",
        title: "How to Make a Video Call",
        description: "Learn how to see and talk to your loved ones face-to-face using video calling apps.",
        iconName: "video",
        orderIndex: 2,
        totalSteps: 4,
        difficulty: "beginner",
        estimatedMinutes: 12,
      },
      {
        id: "lesson-essential-apps",
        title: "Using Essential Apps",
        description: "Learn how to use the camera, messages, and web browser on your phone or tablet.",
        iconName: "smartphone",
        orderIndex: 3,
        totalSteps: 6,
        difficulty: "intermediate",
        estimatedMinutes: 20,
      },
    ];

    lessonsData.forEach((l) => this.lessons.set(l.id, l));

    // Seed Lesson Steps
    const stepsData: LessonStep[] = [
      // Email Lesson Steps
      {
        id: "step-email-1",
        lessonId: "lesson-email",
        stepNumber: 1,
        title: "What is Email?",
        content: "Email (short for electronic mail) is a way to send messages using the internet. It's like sending a letter, but much faster!\n\nWith email, you can:\n- Send messages to family and friends\n- Receive important information\n- Keep in touch with people far away\n\nEmail is free to use and works 24 hours a day.",
        tipText: "Think of email as a digital mailbox that you can check anytime, anywhere.",
        imagePlaceholder: "Illustration of an envelope with a @ symbol",
      },
      {
        id: "step-email-2",
        lessonId: "lesson-email",
        stepNumber: 2,
        title: "Creating an Email Account",
        content: "To use email, you need to create an account. Popular email services include Gmail, Yahoo Mail, and Outlook.\n\nHere's what you'll need:\n1. Choose an email service (Gmail is recommended for beginners)\n2. Pick a username (this will be your email address)\n3. Create a strong password\n4. Add some personal information for account recovery\n\nYour email address will look like: yourname@gmail.com",
        tipText: "Write down your email address and password somewhere safe. You'll need them to log in.",
        imagePlaceholder: "Screenshot of email signup page",
      },
      {
        id: "step-email-3",
        lessonId: "lesson-email",
        stepNumber: 3,
        title: "Understanding the Inbox",
        content: "Your inbox is where all your received emails appear. When you open your email, you'll see:\n\n- Inbox: Where new messages arrive\n- Sent: Messages you've sent to others\n- Drafts: Messages you started but haven't sent yet\n- Trash: Deleted messages\n\nNew emails appear at the top of your inbox. Unread messages are usually shown in bold.",
        tipText: "Check your inbox regularly, but don't worry - important emails will wait for you!",
        imagePlaceholder: "Screenshot of email inbox layout",
      },
      {
        id: "step-email-4",
        lessonId: "lesson-email",
        stepNumber: 4,
        title: "Writing and Sending an Email",
        content: "To send an email:\n\n1. Click the 'Compose' or 'New Email' button\n2. Type the recipient's email address in the 'To' field\n3. Add a subject (what your email is about)\n4. Write your message in the large text area\n5. Click 'Send' when you're ready\n\nTake your time - there's no rush. You can always save as a draft and come back later.",
        tipText: "Always double-check the email address before sending to make sure it goes to the right person.",
        imagePlaceholder: "Screenshot of compose email screen",
      },
      {
        id: "step-email-5",
        lessonId: "lesson-email",
        stepNumber: 5,
        title: "Email Safety Tips",
        content: "Stay safe while using email:\n\n1. Never share your password with anyone\n2. Be careful with emails from people you don't know\n3. Don't click on links or open attachments from strangers\n4. If something seems too good to be true, it probably is\n5. When in doubt, ask a family member or friend for help\n\nRemember: Legitimate companies will never ask for your password via email.",
        tipText: "If you receive a suspicious email, delete it. It's better to be safe!",
        imagePlaceholder: "Illustration of a shield protecting an envelope",
      },

      // Video Call Lesson Steps
      {
        id: "step-video-1",
        lessonId: "lesson-video-call",
        stepNumber: 1,
        title: "What is a Video Call?",
        content: "A video call lets you see and hear someone in real-time, even if they're far away. It's like having a face-to-face conversation through your phone, tablet, or computer.\n\nPopular video calling apps include:\n- FaceTime (for Apple devices)\n- WhatsApp Video\n- Zoom\n- Google Meet\n\nVideo calls are perfect for staying connected with family and friends!",
        tipText: "Video calls are free when you're connected to WiFi.",
        imagePlaceholder: "Illustration of two people on a video call",
      },
      {
        id: "step-video-2",
        lessonId: "lesson-video-call",
        stepNumber: 2,
        title: "Getting Ready for a Video Call",
        content: "Before making a video call:\n\n1. Find a quiet, well-lit place\n2. Make sure your device is charged or plugged in\n3. Check that your internet connection is working\n4. Position your device so your face is visible\n5. Test your camera and microphone\n\nGood lighting means facing a window or light source. Avoid having bright light behind you.",
        tipText: "Prop your device up on a table or stand for a steady image.",
        imagePlaceholder: "Example of good lighting and camera positioning",
      },
      {
        id: "step-video-3",
        lessonId: "lesson-video-call",
        stepNumber: 3,
        title: "Making and Receiving Calls",
        content: "To start a video call:\n\n1. Open your video calling app\n2. Find the person you want to call\n3. Tap the video camera icon\n4. Wait for them to answer\n\nTo answer a video call:\n1. When you see the incoming call, tap 'Accept' or the green button\n2. Your camera will turn on automatically\n\nTo end a call, tap the red button.",
        tipText: "It's okay to decline a call if you're not ready. You can always call back later!",
        imagePlaceholder: "Screenshot showing call and end buttons",
      },
      {
        id: "step-video-4",
        lessonId: "lesson-video-call",
        stepNumber: 4,
        title: "During the Call",
        content: "During a video call, you can:\n\n- Mute your microphone (if there's background noise)\n- Turn your camera off temporarily\n- Switch between front and back camera\n- Wave and smile to say hello!\n\nSpeak clearly and give the other person time to respond. There might be a small delay.\n\nRemember to look at the camera when speaking - this makes it feel like you're making eye contact!",
        tipText: "If the call freezes, try moving closer to your WiFi router or wait a moment.",
        imagePlaceholder: "Screenshot of video call controls",
      },

      // Essential Apps Lesson Steps
      {
        id: "step-apps-1",
        lessonId: "lesson-essential-apps",
        stepNumber: 1,
        title: "Introduction to Phone Apps",
        content: "Apps are programs on your phone or tablet that help you do different things. Your device comes with several useful apps already installed.\n\nThe three essential apps we'll learn about:\n1. Camera - Take photos and videos\n2. Messages - Send text messages\n3. Browser - Search the internet\n\nLook for these app icons on your home screen.",
        tipText: "Apps have icons (small pictures) that you tap to open them.",
        imagePlaceholder: "Icons for Camera, Messages, and Browser apps",
      },
      {
        id: "step-apps-2",
        lessonId: "lesson-essential-apps",
        stepNumber: 2,
        title: "Using the Camera",
        content: "Your phone's camera is great for capturing memories!\n\nTo take a photo:\n1. Open the Camera app\n2. Point your camera at what you want to photograph\n3. Hold your phone steady\n4. Tap the big circular button\n\nTo view your photos, open the Photos or Gallery app. Your pictures are saved automatically.",
        tipText: "Hold your phone with both hands for steadier photos.",
        imagePlaceholder: "Screenshot of camera app interface",
      },
      {
        id: "step-apps-3",
        lessonId: "lesson-essential-apps",
        stepNumber: 3,
        title: "Sending Text Messages",
        content: "Text messages let you send quick written notes to anyone with a phone.\n\nTo send a message:\n1. Open the Messages app\n2. Tap the 'New Message' or '+' button\n3. Type the person's name or phone number\n4. Write your message in the text box\n5. Tap Send (usually an arrow icon)\n\nYou'll see your conversation history with each person.",
        tipText: "You can also send photos in messages - just tap the camera or photo icon!",
        imagePlaceholder: "Screenshot of messaging app",
      },
      {
        id: "step-apps-4",
        lessonId: "lesson-essential-apps",
        stepNumber: 4,
        title: "Using the Web Browser",
        content: "The web browser lets you visit websites and search for information online.\n\nTo search the internet:\n1. Open Safari, Chrome, or your browser app\n2. Tap the search bar at the top\n3. Type what you're looking for (like 'weather today')\n4. Tap Search or Enter\n5. Tap on a result to read it\n\nYou can search for anything - recipes, news, health information, and more!",
        tipText: "Look for the padlock icon in the address bar - it means the website is secure.",
        imagePlaceholder: "Screenshot of browser with search bar highlighted",
      },
      {
        id: "step-apps-5",
        lessonId: "lesson-essential-apps",
        stepNumber: 5,
        title: "Going Back and Navigating",
        content: "When using apps and websites, you might want to go back to where you were.\n\nHere's how:\n- Use the back arrow (usually at the top left or bottom of screen)\n- On iPhones, swipe from the left edge to go back\n- The home button takes you back to your main screen\n\nDon't worry about getting lost - you can always close the app and start fresh!",
        tipText: "If you ever feel stuck, try tapping the home button to start over.",
        imagePlaceholder: "Arrows showing navigation buttons",
      },
      {
        id: "step-apps-6",
        lessonId: "lesson-essential-apps",
        stepNumber: 6,
        title: "Practice and Explore",
        content: "The best way to learn is by practicing! Here are some things to try:\n\n- Take a selfie with the camera\n- Send a 'Hello!' message to a family member\n- Search for your favorite recipe online\n- Look up the weather for tomorrow\n\nRemember: You can't break your phone by exploring! Take your time and don't be afraid to try new things.",
        tipText: "If something doesn't work, ask a family member or try again later. Learning takes time!",
        imagePlaceholder: null,
      },
    ];

    stepsData.forEach((s) => this.lessonSteps.set(s.id, s));

    // Seed some community posts for demonstration
    const samplePosts: CommunityPost[] = [
      {
        id: "post-1",
        userId: "demo-user-1",
        userName: "Margaret",
        category: "learning_tips",
        title: "Taking Screenshots Made Easy!",
        content: "I learned how to take screenshots on my phone today! On my iPhone, I just press the side button and volume up at the same time. It's great for saving recipes I find online. Hope this helps someone!",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        repliesCount: 3,
      },
      {
        id: "post-2",
        userId: "demo-user-2",
        userName: "Robert",
        category: "need_help",
        title: "How do I make the text bigger on my phone?",
        content: "I'm having trouble reading the small text on my Samsung phone. Is there a way to make everything bigger? The font is too small for me to see comfortably.",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        repliesCount: 5,
      },
      {
        id: "post-3",
        userId: "demo-user-3",
        userName: "Dorothy",
        category: "general_questions",
        title: "What's the difference between WiFi and mobile data?",
        content: "My grandson mentioned that I should use WiFi when I'm home to save data. Can someone explain what the difference is? I'm not sure what mobile data means.",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        repliesCount: 7,
      },
    ];

    samplePosts.forEach((p) => this.communityPosts.set(p.id, p));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser & { id: string }): Promise<User> {
    const newUser: User = {
      id: user.id,
      name: user.name,
      email: user.email || null,
      digitalLiteracyLevel: user.digitalLiteracyLevel || null,
      learningStyle: user.learningStyle || null,
      quizCompleted: user.quizCompleted || false,
      textSizePreference: user.textSizePreference || "medium",
      highContrastMode: user.highContrastMode || false,
    };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Quiz methods
  async getQuizQuestions(): Promise<QuizQuestionWithOptions[]> {
    const questions = Array.from(this.quizQuestions.values()).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    return questions.map((q) => ({
      ...q,
      options: Array.from(this.quizOptions.values())
        .filter((o) => o.questionId === q.id)
        .sort((a, b) => a.orderIndex - b.orderIndex),
    }));
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonSteps(lessonId: string): Promise<LessonStep[]> {
    return Array.from(this.lessonSteps.values())
      .filter((s) => s.lessonId === lessonId)
      .sort((a, b) => a.stepNumber - b.stepNumber);
  }

  async getLessonsWithProgress(userId: string): Promise<LessonWithProgress[]> {
    const lessons = await this.getLessons();
    const progress = await this.getAllProgress(userId);

    return lessons.map((lesson) => ({
      ...lesson,
      progress: progress.find((p) => p.lessonId === lesson.id),
    }));
  }

  // Progress methods
  async getProgress(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const key = `${userId}-${lessonId}`;
    return this.userProgress.get(key);
  }

  async getAllProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (p) => p.oderId === userId
    );
  }

  async updateProgress(
    userId: string,
    lessonId: string,
    currentStep: number,
    completed: boolean
  ): Promise<UserProgress> {
    const key = `${userId}-${lessonId}`;
    const existing = this.userProgress.get(key);

    const progress: UserProgress = {
      id: existing?.id || randomUUID(),
      oderId: userId,
      lessonId,
      currentStep,
      completed,
      lastAccessedAt: new Date(),
    };

    this.userProgress.set(key, progress);
    return progress;
  }

  async getProgressStats(userId: string): Promise<{ completed: number; total: number; percentage: number }> {
    const lessons = await this.getLessons();
    const progress = await this.getAllProgress(userId);
    const completed = progress.filter((p) => p.completed).length;
    const total = lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }

  // Community methods
  async getPosts(category?: string): Promise<CommunityPost[]> {
    let posts = Array.from(this.communityPosts.values());
    if (category && category !== "all") {
      posts = posts.filter((p) => p.category === category);
    }
    return posts.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const newPost: CommunityPost = {
      id: randomUUID(),
      userId: post.userId,
      userName: post.userName,
      category: post.category,
      title: post.title,
      content: post.content,
      createdAt: new Date(),
      repliesCount: 0,
    };
    this.communityPosts.set(newPost.id, newPost);
    return newPost;
  }

  async getReplies(postId: string): Promise<CommunityReply[]> {
    return Array.from(this.communityReplies.values())
      .filter((r) => r.postId === postId)
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }
}

export const storage = new MemStorage();
