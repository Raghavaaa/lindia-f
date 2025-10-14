import { NextRequest } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation, createCaseSchema, paginationSchema, serverError } from "@/lib/middleware/validation";
import { createCase, getCasesByUserId } from "@/lib/database/services";
import { createActivity } from "@/lib/database/services";

async function handleCreateCase(req: AuthenticatedRequest, data: any) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const caseData = await createCase({
      ...data,
      assignedTo: userId,
      isActive: true
    });

    // Log activity
    await createActivity({
      type: 'case',
      action: 'create',
      description: `Created case: ${caseData.title}`,
      userId,
      clientId: caseData.clientId,
      caseId: caseData.id
    });

    return Response.json({ success: true, data: caseData });
  } catch (error) {
    console.error("Create case error:", error);
    return serverError("Failed to create case");
  }
}

async function handleGetCases(req: AuthenticatedRequest, data: any) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return Response.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const { cases, total } = await getCasesByUserId(userId, data);

    return Response.json({
      success: true,
      data: cases,
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages: Math.ceil(total / data.limit)
      }
    });
  } catch (error) {
    console.error("Get cases error:", error);
    return serverError("Failed to fetch cases");
  }
}

export const POST = withAuth(
  withValidation(createCaseSchema)(handleCreateCase)
);

export const GET = withAuth(
  withValidation(paginationSchema)(handleGetCases)
);

