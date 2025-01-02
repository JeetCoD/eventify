import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

type UserData = {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  image_url: string;
  first_name?: string;
  last_name?: string;
  username?: string;
};

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing required Svix headers" },
        { status: 400 }
      );
    }

    // Get and verify the payload
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { error: "Error verifying webhook signature" },
        { status: 400 }
      );
    }

    const { type: eventType, data } = evt;
    const userData = data as UserData;

    switch (eventType) {
      case "user.created": {
        const {
          id,
          email_addresses = [],
          image_url,
          first_name = "",
          last_name = "",
          username = "",
        } = userData;

        const user = {
          clerkId: id,
          email: email_addresses[0]?.email_address || "",
          username: username,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        };

        const newUser = await createUser(user);

        if (newUser) {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
        }

        return NextResponse.json({ message: "OK", user: newUser });
      }

      case "user.updated": {
        const {
          id,
          image_url,
          first_name = "",
          last_name = "",
          username = "",
        } = userData;

        const user = {
          firstName: first_name,
          lastName: last_name,
          username: username,
          photo: image_url,
        };

        const updatedUser = await updateUser(id, user);
        return NextResponse.json({ message: "OK", user: updatedUser });
      }

      case "user.deleted": {
        const { id } = userData;
        if (!id) {
          return NextResponse.json(
            { error: "Missing user ID" },
            { status: 400 }
          );
        }

        const deletedUser = await deleteUser(id);
        return NextResponse.json({ message: "OK", user: deletedUser });
      }

      default:
        return NextResponse.json(
          { message: "Webhook received" },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
