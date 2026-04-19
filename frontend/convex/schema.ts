import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  jobs: defineTable({
    id: v.string(), // Local ID from constants
    title: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.string(),
    logo: v.string(),
    category: v.string(),
    type: v.string(),
    banner: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
  }).index("by_custom_id", ["id"])
    .index("by_category", ["category"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    savedJobIds: v.array(v.string()), // Array of job IDs
  }).index("by_email", ["email"]),
});
