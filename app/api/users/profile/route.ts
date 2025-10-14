import { NextRequest } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation, updateUserSchema, serverError } from "@/lib/middleware/validation";
import { getUserById, updateUser } from "@/lib/database/services";
import { createActivity } from "@/lib/database/services";

async function handleGetProfile(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...userProfile } = user;

    return Response.json({ success: true, data: userProfile });
  } catch (error) {
    console.error("Get profile error:", error);
    return serverError("Failed to fetch profile");
  }
}

async function handleUpdateProfile(req: AuthenticatedRequest, data: any) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const updatedUser = await updateUser(userId, data);
    
    if (!updatedUser) {
      return serverError("Failed to update profile");
    }

    // Log activity
    await createActivity({
      type: 'user',
      action: 'update_profile',
      description: "Updated user profile",
      userId
    });

    // Remove sensitive data
    const { password, ...userProfile } = updatedUser;

    return Response.json({ success: true, data: userProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    return serverError("Failed to update profile");
  }
}

export const GET = withAuth(handleGetProfile);

export const PUT = withAuth(
  withValidation(updateUserSchema)(handleUpdateProfile)
);

