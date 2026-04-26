import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("jobs").withIndex("by_category", q => q.eq("category", args.category)).collect();
  },
});

export const getById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const getRecommended = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jobs").take(10); // Ambil 10 untuk rekomendasi
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jobs").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) return await ctx.db.query("jobs").collect();
    
    // Simple filter search for now
    const all = await ctx.db.query("jobs").collect();
    return all.filter(job => 
      job.title.toLowerCase().includes(args.query.toLowerCase()) ||
      job.company.toLowerCase().includes(args.query.toLowerCase()) ||
      job.category.toLowerCase().includes(args.query.toLowerCase())
    );
  },
});

export const getByIds = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, args) => {
    const jobs = [];
    for (const id of args.ids) {
      try {
        // Only try to get if it looks like a Convex ID
        if (id.length > 5) {
          const job = await ctx.db.get(id as any);
          if (job) jobs.push(job);
        }
      } catch (e) {
        // Skip invalid IDs
      }
    }
    return jobs;
  },
});

export const seedJobs = mutation({
  args: {
    jobs: v.array(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing jobs to avoid duplicates during seed
    const existingJobs = await ctx.db.query("jobs").collect();
    for (const job of existingJobs) {
      await ctx.db.delete(job._id);
    }

    for (const job of args.jobs) {
      await ctx.db.insert("jobs", job);
    }
  },
});

export const runSeed = mutation({
  args: {
    jobs: v.array(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing jobs
    const existingJobs = await ctx.db.query("jobs").collect();
    for (const job of existingJobs) {
      await ctx.db.delete(job._id);
    }

    for (const job of args.jobs) {
      await ctx.db.insert("jobs", job);
    }
    return `Seeded ${args.jobs.length} jobs.`;
  },
});

export const createJob = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", args);
  },
});
