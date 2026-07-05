import { PlatformRole, SubscriptionTier } from "@prisma/client";

export interface AIPermissionContext {
  role: PlatformRole;
  tier: SubscriptionTier;
}

export class AIPermissionLayer {
  static checkPermission(
    requiredPermissions: string[],
    context: AIPermissionContext
  ): boolean {
    if (requiredPermissions.includes("premium-tier") && context.tier === "FREE") {
      return false;
    }
    if (
      requiredPermissions.includes("recruiter-role") &&
      context.role !== "RECRUITER" &&
      context.role !== "ADMIN"
    ) {
      return false;
    }
    if (requiredPermissions.includes("admin-role") && context.role !== "ADMIN") {
      return false;
    }
    return true;
  }
}
