import prisma from '../../lib/prisma';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'REORDER' | 'EXPORT';

export async function recordAudit(
  userId: number,
  action: AuditAction,
  entityType: string,
  entityId: number,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, details: details as object | undefined },
    });
  } catch (err) {
    // Auditing must never break the user's write.
    console.error('[audit] failed to record entry:', err);
  }
}
