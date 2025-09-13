// Convex schema

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    followers: v.number(), // We could store it as a list instead, but this is fine for now
    following: v.number(), // Same as above,
    posts: v.number(),
    clerkId: v.string(), // This is given to each user by Clerk
  }).index("by_clerk_id", ["clerkId"]), // To get the user by their Clerk ID

  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id("_storage"), // We'll store the image in Convex storage (used when deleting posts)
    caption: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
  }).index("by_user", ["userId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
  }).index("by_post", ["postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),

  notifications: defineTable({
    receiverId: v.id("users"),
    senderId: v.id("users"),
    // The notification could be either a "like", a "follow", or a "comment"
    type: v.union(v.literal("like"), v.literal("follow"), v.literal("comment")), // `litearl()` : validates that the value is equal to the given literal value
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
  }).index("by_receiver", ["receiverId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),
});
