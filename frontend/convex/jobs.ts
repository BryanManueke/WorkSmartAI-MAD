import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all jobs
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jobs").collect();
  },
});

// Get jobs by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get a single job by its custom ID
export const getById = query({
  args: { jobId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_custom_id", (q) => q.eq("id", args.jobId))
      .unique();
  },
});

// Bulk insert jobs (for seeding)
export const bulkInsert = mutation({
  args: {
    jobs: v.array(v.object({
      id: v.string(),
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
    }))
  },
  handler: async (ctx, args) => {
    for (const job of args.jobs) {
      const existing = await ctx.db
        .query("jobs")
        .withIndex("by_custom_id", (q) => q.eq("id", job.id))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("jobs", job);
      }
    }
  },
});
