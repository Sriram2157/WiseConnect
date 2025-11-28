import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile with quiz results and preferences
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  digitalLiteracyLevel: text("digital_literacy_level"), // beginner, intermediate, advanced
  learningStyle: text("learning_style"), // visual, auditory, mixed
  quizCompleted: boolean("quiz_completed").default(false),
  textSizePreference: text("text_size_preference").default("medium"), // small, medium, large, extra-large
  highContrastMode: boolean("high_contrast_mode").default(false),
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // literacy, learning_style
  orderIndex: integer("order_index").notNull(),
});

// Quiz options for each question
export const quizOptions = pgTable("quiz_options", {
  id: varchar("id", { length: 36 }).primaryKey(),
  questionId: varchar("question_id", { length: 36 }).notNull(),
  optionText: text("option_text").notNull(),
  value: text("value").notNull(), // The value this option represents
  orderIndex: integer("order_index").notNull(),
});

// Lesson modules
export const lessons = pgTable("lessons", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  orderIndex: integer("order_index").notNull(),
  totalSteps: integer("total_steps").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedMinutes: integer("estimated_minutes").notNull(),
});

// Lesson steps (individual screens within a lesson)
export const lessonSteps = pgTable("lesson_steps", {
  id: varchar("id", { length: 36 }).primaryKey(),
  lessonId: varchar("lesson_id", { length: 36 }).notNull(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tipText: text("tip_text"),
  imagePlaceholder: text("image_placeholder"),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id", { length: 36 }).primaryKey(),
  oderId: varchar("user_id", { length: 36 }).notNull(),
  lessonId: varchar("lesson_id", { length: 36 }).notNull(),
  currentStep: integer("current_step").default(0),
  completed: boolean("completed").default(false),
  lastAccessedAt: timestamp("last_accessed_at"),
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  userName: text("user_name").notNull(),
  category: text("category").notNull(), // need_help, learning_tips, general_questions
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  repliesCount: integer("replies_count").default(0),
});

// Community replies
export const communityReplies = pgTable("community_replies", {
  id: varchar("id", { length: 36 }).primaryKey(),
  postId: varchar("post_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  userName: text("user_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });
export const insertQuizOptionSchema = createInsertSchema(quizOptions).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertLessonStepSchema = createInsertSchema(lessonSteps).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, createdAt: true, repliesCount: true });
export const insertCommunityReplySchema = createInsertSchema(communityReplies).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizOption = typeof quizOptions.$inferSelect;
export type InsertQuizOption = z.infer<typeof insertQuizOptionSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type LessonStep = typeof lessonSteps.$inferSelect;
export type InsertLessonStep = z.infer<typeof insertLessonStepSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

export type CommunityReply = typeof communityReplies.$inferSelect;
export type InsertCommunityReply = z.infer<typeof insertCommunityReplySchema>;

// Quiz submission schema
export const quizSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    selectedValue: z.string(),
  })),
  userName: z.string().min(1),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

// Full quiz question with options
export interface QuizQuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

// Lesson with progress
export interface LessonWithProgress extends Lesson {
  progress?: UserProgress;
}
