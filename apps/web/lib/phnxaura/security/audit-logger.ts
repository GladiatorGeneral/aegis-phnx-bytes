// lib/phnxaura/security/audit-logger.ts
import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

interface AuditEvent {
  agentId: string;
  action: string;
  resource: string;
  outcome: 'SUCCESS' | 'FAILURE';
  ip: string;
  userAgent: string;
  metadata?: Record<string, any>;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class AuditLogger {
  
  constructor() {}

  async log(event: AuditEvent) {
    await db.insert(auditLogs).values({
      id: uuidv4(),
      agentId: event.agentId,
      action: event.action,
      resource: event.resource,
      outcome: event.outcome,
      ipHash: await this.hashIp(event.ip),
      userAgent: event.userAgent,
      metadata: event.metadata,
      riskScore: this.calculateRiskScore(event)
    });

    // Real-time alerting for high-risk events
    if (event.riskLevel === 'HIGH') {
      await this.triggerSecurityAlert(event);
    }
  }

  private calculateRiskScore(event: AuditEvent): number {
    let score = 0;
    if (event.action.includes('DELETE')) score += 30;
    if (event.action.includes('ADMIN')) score += 40;
    if (event.outcome === 'FAILURE') score += 20;
    return Math.min(score, 100);
  }

  private async hashIp(ip: string): Promise<string> {
    // Privacy-preserving IP logging
    // For simplicity sake just masking
    return ip.split('.').slice(0, 2).join('.') + '.xxx.xxx';
  }

  private async triggerSecurityAlert(event: AuditEvent) {
    // Send to Slack/PagerDuty
    if (process.env.SECURITY_WEBHOOK_URL) {
        try {
            await fetch(process.env.SECURITY_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🚨 Security Alert: ${event.action} by ${event.agentId}`
            })
            });
        } catch (e) {
            console.error("Failed to send security alert", e);
        }
    }
  }
}
