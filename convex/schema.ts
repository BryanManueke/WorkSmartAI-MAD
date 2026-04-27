import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    avatar: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    gradYear: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    preferredJobType: v.optional(v.string()),
    targetLocation: v.optional(v.string()),
    salaryExpectation: v.optional(v.number()),
    role: v.optional(v.string()), // 'seeker' or 'admin'
    summary: v.optional(v.string()),
    website: v.optional(v.string()),
    education: v.optional(v.string()), // JSON string for complexity
    experience: v.optional(v.string()), // JSON string for complexity
    aiRecommendations: v.optional(v.array(v.object({
      jobId: v.id("jobs"),
      score: v.number(),
      reason: v.string(),
    }))),
  }).index("by_email", ["email"]),
  
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.string(),
    logo: v.string(),
    category: v.string(),
    type: v.string(),
    banner: v.string(),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
  }).index("by_category", ["category"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
  }).index("by_user", ["userId"])
    .index("by_user_job", ["userId", "jobId"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    text: v.string(),
    sender: v.string(),
  }).index("by_user", ["userId"]),
});
