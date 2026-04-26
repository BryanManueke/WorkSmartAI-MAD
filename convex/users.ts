import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", args.email)).first();
    if (!user || user.password !== args.password) {
      throw new Error("Email atau password salah.");
    }
    return user;
  },
});

export const create = mutation({
  args: { name: v.string(), email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", args.email)).first();
    if (existing) {
      throw new Error("Email sudah terdaftar.");
    }
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "seeker",
    });
    return await ctx.db.get(userId);
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
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
    summary: v.optional(v.string()),
    website: v.optional(v.string()),
    education: v.optional(v.string()),
    experience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
  },
});

export const storeUser = mutation({
  args: { name: v.string(), email: v.string(), avatar: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", args.email)).first();
    if (existing) {
      // Update avatar if provided and user doesn't have one
      if (args.avatar && !existing.avatar) {
        await ctx.db.patch(existing._id, { avatar: args.avatar });
      }
      return await ctx.db.get(existing._id);
    }
    
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      avatar: args.avatar,
      role: "seeker",
    });
    return await ctx.db.get(userId);
  },
});

export const makeAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", args.email)).first();
    if (!user) throw new Error("User not found.");
    await ctx.db.patch(user._id, { role: "admin" });
    return "User is now an admin.";
  },
});

// v4 - Added updatePassword for security
export const updatePassword = mutation({
  args: { userId: v.id("users"), oldPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Pengguna tidak ditemukan.");
    if (user.password && user.password !== args.oldPassword) {
      throw new Error("Kata sandi lama salah.");
    }
    await ctx.db.patch(args.userId, { password: args.newPassword });
    return "Kata sandi berhasil diubah.";
  },
});

// v3 - Renamed to getProfile to force refresh
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
