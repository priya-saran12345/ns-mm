// ------------------ API-level types ------------------
export type Code = string;

export interface APUserLite {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface AssignedPermission {
  id: number;
  user_id: number;
  user: APUserLite;
  mcc_codes: Code[];
  mpp_codes: Code[];
  formsteps_ids: number[];   // the numeric step-ids
  form_steps: any[];         // leave wide for now (unknown shape)
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export type AssignedPermissionsResponse =
  | { success: true; message: string; data: AssignedPermission[] }
  | { success: false; message: string };

// ------------------ Redux state types ------------------
export interface RootStateWithAP {
  auth: { token: string | null };
  assignedPermissions: AssignedPermissionsState;
}

export interface AssignedPermissionsState {
  // raw list from API
  items: AssignedPermission[];
  loading: boolean;
  error: string | null;

  // ui state
  search: string;
  page: number;
  limit: number;
}

// ------------------ Table row type ------------------
export type APTableRow = {
  key: number;
  id: number;
  name: string;
  email: string;
  assignedSection: string; // "4,5"
  assignedMcc: string;     // "001,002"
  assignedMpp: string;     // "00103,00109" (optional column if you add it)
};
