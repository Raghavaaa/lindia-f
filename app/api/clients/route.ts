import { NextRequest } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation, createClientSchema, paginationSchema, serverError } from "@/lib/middleware/validation";
import { createClient, getClientsByUserId } from "@/lib/database/services";
import { createActivity } from "@/lib/database/services";

async function handleCreateClient(req: AuthenticatedRequest, data: any) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const client = await createClient({
      ...data,
      userId,
      isActive: true
    });

    // Log activity
    await createActivity({
      type: 'client',
      action: 'create',
      description: `Created client: ${client.name}`,
      userId,
      clientId: client.id
    });

    return Response.json({ success: true, data: client });
  } catch (error) {
    console.error("Create client error:", error);
    return serverError("Failed to create client");
  }
}

async function handleGetClients(req: AuthenticatedRequest, data: any) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const { clients, total } = await getClientsByUserId(userId, data);

    return Response.json({
      success: true,
      data: clients,
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages: Math.ceil(total / data.limit)
      }
    });
  } catch (error) {
    console.error("Get clients error:", error);
    return serverError("Failed to fetch clients");
  }
}

export const POST = withAuth(
  withValidation(createClientSchema)(handleCreateClient)
);

export const GET = withAuth(
  withValidation(paginationSchema)(handleGetClients)
);

