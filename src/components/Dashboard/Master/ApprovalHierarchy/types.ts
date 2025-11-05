
export interface MasterDataImportSummary {
  inserted: number;
  updated: number;
  failed: number;
  errors?: Array<{ row?: number; message: string }>;
}

export interface ApprovalHierarchyRow {
  id: number;
  levelCount: number;
  level1: string;
  levels: string[];
  status: "Active" | "Inactive";
}

export interface RootStateWithApprovalHierarchy {
  auth: { token: string | null };
  approvalHierarchy: ApprovalHierarchyState;
}

export interface ApprovalHierarchyState {
  rows: ApprovalHierarchyRow[];
  loading: boolean;
  error: string | null;
  importing: boolean;
  exporting: boolean;
  search: string;
  page: number;
  limit: number;
  total: number;
  levelFilter?: number;
}
