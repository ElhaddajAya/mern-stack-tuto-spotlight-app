import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Create a user in the database
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    clerkId: v.string(),
  },

  // Function implementation
  handler: async (ctx, args) => {
    // First check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (query) => query.eq("clerkId", args.clerkId))
      .unique();

    // If user already exists, return
    if (existingUser) {
      return existingUser;
    }

    // If not, create the user
    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      image: args.image,
      bio: args.bio,
      clerkId: args.clerkId,
      followers: 0, // When user first signs up, they have 0 followers, 0 following, and 0 posts
      following: 0,
      posts: 0,
    });
  },
});
