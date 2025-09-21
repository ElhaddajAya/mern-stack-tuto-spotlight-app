import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// 1- we need to make sure that the webhook event is coming from Clerk
// 2- if so, we will listen for the "user.created" event
// 3- we will save the user to the database

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Check if the environment variable is set
    const webhookScret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookScret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    // Check headers: Check if webhook is coming from Clerk
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing headers", { status: 400 });
    }

    const payload = await request.json(); // Get the body of the request
    const body = JSON.stringify(payload); // Convert the body to a string

    // Create webhook and pass webhookScret
    const wh = new Webhook(webhookScret);

    let evt;
    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any; // Cast the event to `any` type
    } catch (error) {
      console.log("Error verifying webhook: ", error);
      return new Response("Error verifying webhook", { status: 400 });
    }

    const eventType = evt.type; // Get the type of the event
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data; // Destructure the event data

      const email = email_addresses[0].email_address; // User email (first email address cuz user might have multiple email addresses)
      const name = `${first_name || ""} ${last_name || ""}`.trim(); // User username (first name + last name)

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log("Error creating user: ", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook received successfully", { status: 200 });
  }),
});

export default http;
