// Returned entry from GET /permissions/{role_id}
export interface PermissionEntry {
  id: number;            // permission row id
  module_id: number;     // the module that has a permission record
  status: boolean;       // whether permission is granted
  module: {
    id: number;
    name: string;
    status: boolean;
    parent_id: number | null;
  };
}

export type PermissionsApiResponse =
  | { success: true; message: string; data: { modules: PermissionEntry[] } }
  | { success: false; message: string };

// (Optional) payload if your backend supports saving/upserting permissions.
// If your API differs, tweak this to match.
export interface SavePermissionsRequest {
  permissions: Array<{ module_id: number; status: boolean }>;
}
export type SavePermissionsApiResponse =
  | { success: true; message: string }
  | { success: false; message: string };

// Slice state
export interface PermissionsState {
  loading: boolean;
  saving: boolean;
  error: string | null;

  roleId: number | null;

  // normalized selected module ids for the currently loaded role
  selectedIds: number[];        // store as array (stable for devtools); convert to Set in UI
}
