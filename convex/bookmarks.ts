import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: { userId: v.id("users"), jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { status: "removed" };
    } else {
      await ctx.db.insert("bookmarks", {
        userId: args.userId,
        jobId: args.jobId,
      });
      return { status: "added" };
    }
  },
});

export const getSavedJobs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const jobs = [];
    for (const bookmark of bookmarks) {
      const job = await ctx.db.get(bookmark.jobId);
      if (job) jobs.push(job);
    }
    return jobs;
  },
});

export const checkIsSaved = query({
  args: { userId: v.id("users"), jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();
    return !!existing;
  },
});
