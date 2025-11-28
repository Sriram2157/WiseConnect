import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import { quizSubmissionSchema, insertCommunityPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Quiz endpoints
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const parsed = quizSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid quiz submission" });
      }

      const { answers, userName } = parsed.data;

      // Calculate digital literacy level based on answers
      const literacyAnswers = answers.filter(
        (a) => a.questionId.startsWith("q") && !a.questionId.includes("4")
      );
      
      const literacyScores: Record<string, number> = {
        beginner: 0,
        intermediate: 1,
        advanced: 2,
      };

      let totalScore = 0;
      literacyAnswers.forEach((a) => {
        totalScore += literacyScores[a.selectedValue] || 0;
      });

      const avgScore = totalScore / (literacyAnswers.length || 1);
      let digitalLiteracyLevel = "beginner";
      if (avgScore >= 1.5) {
        digitalLiteracyLevel = "advanced";
      } else if (avgScore >= 0.5) {
        digitalLiteracyLevel = "intermediate";
      }

      // Get learning style from last question
      const styleAnswer = answers.find((a) => a.questionId === "q4");
      const learningStyle = styleAnswer?.selectedValue || "mixed";

      // Create user
      const userId = randomUUID();
      const user = await storage.createUser({
        id: userId,
        name: userName,
        email: null,
        digitalLiteracyLevel,
        learningStyle,
        quizCompleted: true,
        textSizePreference: "large",
        highContrastMode: false,
      });

      res.json({
        userId: user.id,
        name: user.name,
        digitalLiteracyLevel: user.digitalLiteracyLevel,
        learningStyle: user.learningStyle,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // Lesson endpoints
  app.get("/api/lessons", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      
      if (userId) {
        const lessons = await storage.getLessonsWithProgress(userId);
        res.json(lessons);
      } else {
        const lessons = await storage.getLessons();
        res.json(lessons);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string | undefined;

      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const steps = await storage.getLessonSteps(id);
      let progress = null;

      if (userId) {
        progress = await storage.getProgress(userId, id);
      }

      res.json({ lesson, steps, progress });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.post("/api/lessons/:id/progress", async (req, res) => {
    try {
      const { id: lessonId } = req.params;
      const { userId, currentStep, completed } = req.body;

      if (!userId || currentStep === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const progress = await storage.updateProgress(
        userId,
        lessonId,
        currentStep,
        completed || false
      );

      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Progress stats endpoint
  app.get("/api/progress/stats", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const stats = await storage.getProgressStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress stats" });
    }
  });

  // Community endpoints
  app.get("/api/community/posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const posts = await storage.getPosts(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const replies = await storage.getReplies(id);
      res.json({ post, replies });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const parsed = insertCommunityPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid post data" });
      }

      const post = await storage.createPost(parsed.data);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  return httpServer;
}
