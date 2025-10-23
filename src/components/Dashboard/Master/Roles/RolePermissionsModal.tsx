import React, { useEffect, useMemo, useState } from "react";
import { Modal, Collapse, Switch, Spin, Alert } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";

import { fetchModulesThunk } from "../../Master/Modules/thunk";
import type { UIModule } from "../../Master/Modules/types";

import {
  fetchPermissionsByRoleThunk,
  savePermissionsForRoleThunk,
} from "../Permissions/thunk";
import { togglePermission } from "../Permissions/slice";

type Props = {
  open: boolean;
  roleName?: string;
  roleId: number | null;
  onClose: () => void;
  onSaved?: () => void;
};

const RolePermissionsModal: React.FC<Props> = ({
  open,
  roleId,
  roleName,
  onClose,
  onSaved,
}) => {
  const dispatch = useAppDispatch();

  const modulesState = useAppSelector((s) => s.modules);
  const {
    items: modules,
    loading: modulesLoading,
    error: modulesError,
  } = modulesState ?? { items: [], loading: false, error: null };

  const permState = useAppSelector((s) => s.permissions);
  const {
    loading: permLoading,
    saving,
    error: permError,
    selectedIds,
  } = permState;

  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  // Load modules + permissions whenever modal opens or role changes
  useEffect(() => {
    if (!open || !roleId) return;

    if (!modules || modules.length === 0) {
      dispatch(
        fetchModulesThunk({
          path: "modules",
          page: 1,
          limit: 100,
          sort_by: "created_at",
          sort: "desc",
        })
      ).unwrap().catch(() => {});
    }

    dispatch(fetchPermissionsByRoleThunk(roleId)).unwrap().catch(() => {});
  }, [open, roleId]);

  // Flatten all module ids (parents + children)
  const allModuleIds = useMemo(() => {
    const ids: number[] = [];
    (modules || []).forEach((m) => {
      ids.push(m.id);
      (m.children || []).forEach((c) => ids.push(c.id));
    });
    // de-dup just in case
    return Array.from(new Set(ids));
  }, [modules]);

  const parents = useMemo(
    () => (modules || []).filter((m: UIModule) => m.parent_id === null),
    [modules]
  );

  const isChecked = (id: number) => selectedIds.includes(id);
  const onToggle = (id: number) => dispatch(togglePermission(id));

  // Build and send: { modules: [{module_id, status}, ...] }
  const onSave = async () => {
    if (!roleId) return;
    const body = {
      permissions: allModuleIds.map((id) => ({
        module_id: id,
        status: selectedIds.includes(id),
      })),
    };

    try {
      await dispatch(
        savePermissionsForRoleThunk({
          roleId,
          payload: body,
        })
      ).unwrap();
      onSaved?.();
      onClose();
    } catch {
      /* error is handled in slice */
    }
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold">
          Manage Privilege{roleName ? ` – ${roleName}` : ""}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={900}
      destroyOnClose
      footer={
        <div className="mt-5 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-blue text-white disabled:opacity-60"
            disabled={saving}
            onClick={onSave}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <div className="text-red-600 mb-3">
        Upon clicking the 'Save' button, the menu or submenu displayed will be tailored to{" "}
        {roleName ? `'${roleName}'` : "this role"}.
      </div>

      {(modulesLoading || permLoading) && (
        <div className="my-4">
          <Spin /> <span className="ml-2">Loading…</span>
        </div>
      )}
      {!!modulesError && <Alert type="error" message={modulesError} className="mb-3" />}
      {!!permError && <Alert type="error" message={permError} className="mb-3" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {parents.map((p) => {
          const children = p.children || [];
          const isActive = activeParentId === p.id;

          // No-children: simple card with toggle (no accordion caret)
          if (children.length === 0) {
            return (
              <div
                key={p.id}
                className="rounded-lg border border-gray-200  bg-[#FAFAFA] shadow-sm overflow-hidden"
                style={{ padding: 5 }}
              >
                <div className="flex justify-between items-center w-full px-4 py-3">
                  <span className="font-semibold">{p.name}</span>
                  <Switch checked={isChecked(p.id)} onChange={() => onToggle(p.id)} className="mr-4" />
                </div>
              </div>
            );
          }

          // Has children: keep accordion/caret
          return (
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white"
            >
              <Collapse
                bordered={false}
                activeKey={isActive ? [p.id] : []}
                onChange={() => setActiveParentId(isActive ? null : p.id)}
                expandIconPosition="end"
              >
                <Collapse.Panel
                  key={p.id}
                  header={
                    <div className="flex justify-between items-center w-full px-4 py-3">
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-3">
                    {children.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center rounded-md border px-3 py-2"
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        <Switch checked={isChecked(c.id)} onChange={() => onToggle(c.id)} />
                      </div>
                    ))}
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default RolePermissionsModal;
