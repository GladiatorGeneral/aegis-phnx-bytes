export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sku?: string;
}

export interface DocumentData {
  type: 'invoice' | 'contract' | 'change_order' | 'waiver' | 'unknown';
  dates: string[];
  amounts: number[];
  clauses: string[];
  vendor?: string;
  projectId?: string;
  
  // Enhanced Fields
  invoiceNumber?: string;
  subtotal?: number;
  tax?: number;
  retainage?: number;
  lineItems?: LineItem[];
  validationFlags?: string[];
}

export interface ComplianceResult {
  isCompliant: boolean;
  relevantCodes: string[];
  violations: string[];
  recommendations: string[];
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  description: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface CashFlowProjection {
  monthly: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  totalProjected: number;
}

// Unified tool response type
export type ToolResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
