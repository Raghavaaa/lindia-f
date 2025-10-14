import { NextRequest } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation, updateClientSchema, idParamSchema, notFoundError, serverError } from "@/lib/middleware/validation";
import { getClientById, updateClient, deleteClient } from "@/lib/database/services";
import { createActivity } from "@/lib/database/services";

async function handleGetClient(req: AuthenticatedRequest, data: any) {
  try {
    const { id } = data;
    const client = await getClientById(id);
    
    if (!client) {
      return notFoundError("Client");
    }

    return Response.json({ success: true, data: client });
  } catch (error) {
    console.error("Get client error:", error);
    return serverError("Failed to fetch client");
  }
}

async function handleUpdateClient(req: AuthenticatedRequest, data: any) {
  try {
    const { id } = data;
    const userId = req.user?.id;
    
    const client = await getClientById(id);
    if (!client) {
      return notFoundError("Client");
    }

    // Check if user owns this client
    if (client.userId !== userId) {
      return Response.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const updatedClient = await updateClient(id, data);
    
    if (!updatedClient) {
      return serverError("Failed to update client");
    }

    // Log activity
    await createActivity({
      type: 'client',
      action: 'update',
      description: `Updated client: ${updatedClient.name}`,
      userId: userId!,
      clientId: id
    });

    return Response.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error("Update client error:", error);
    return serverError("Failed to update client");
  }
}

async function handleDeleteClient(req: AuthenticatedRequest, data: any) {
  try {
    const { id } = data;
    const userId = req.user?.id;
    
    const client = await getClientById(id);
    if (!client) {
      return notFoundError("Client");
    }

    // Check if user owns this client
    if (client.userId !== userId) {
      return Response.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const success = await deleteClient(id);
    
    if (!success) {
      return serverError("Failed to delete client");
    }

    // Log activity
    await createActivity({
      type: 'client',
      action: 'delete',
      description: `Deleted client: ${client.name}`,
      userId: userId!
    });

    return Response.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Delete client error:", error);
    return serverError("Failed to delete client");
  }
}

export const GET = withAuth(
  withValidation(idParamSchema)(handleGetClient)
);

export const PUT = withAuth(
  withValidation({ ...idParamSchema, ...updateClientSchema })(handleUpdateClient)
);

export const DELETE = withAuth(
  withValidation(idParamSchema)(handleDeleteClient)
);

