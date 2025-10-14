import React, { useEffect, useMemo, useState } from "react";
import { Modal, Collapse, Switch, Spin, Alert } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchModulesThunk } from "../../Master/Modules/thunk";
import type { UIModule } from "../../Master/Modules/types";

type Props = {
  open: boolean;
  roleName?: string;
  roleId: number | null;
  onClose: () => void;
  onSaved?: () => void;
};

export default function RolePermissionsModal({ open, roleId, roleName, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (s: any) => s.modules || { items: [], loading: false, error: null }
  );

  // Keep “only one open” across the grid
  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  // Selected module ids for this role (local UI state)
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!open) return;
    if (!items || items.length === 0) {
      dispatch(
        fetchModulesThunk({
          path: "modules",
          page: 1,
          limit: 100,
          sort_by: "created_at",
          sort: "desc",
        })
      )
        .unwrap()
        .catch(() => {});
    }
    // TODO: load role’s existing permissions and setSelected(new Set(ids))
  }, [open, items?.length, dispatch]);

  // Reset when closing
  useEffect(() => {
    if (!open) {
      setSelected(new Set());
      setActiveParentId(null);
    }
  }, [open]);

  const parents = useMemo(
    () => (items || []).filter((m: UIModule) => m.parent_id === null),
    [items]
  );

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal
      title={<div className="text-lg font-semibold">Manage Privilege{roleName ? ` – ${roleName}` : ""}</div>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
      destroyOnClose
    >
      <div className="text-red-600 mb-3">
        Upon clicking the 'Check' button, the menu or submenu displayed will be tailored to{" "}
        {roleName ? `'${roleName}'` : "this role"}.
      </div>

      {loading && (
        <div className="my-4">
          <Spin /> <span className="ml-2">Loading modules…</span>
        </div>
      )}
      {!!error && <Alert type="error" message={error} className="mb-3" />}

      {/* 2-column grid of modules, each with its own border */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {parents.map((p) => {
          const children = p.children || [];
          const isActive = activeParentId === p.id;

          return (
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white"
            >
              {/* One-panel Collapse per module so we can style each card AND keep accordion */}
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
                  {/* Parent with no children → toggle itself */}
                  {children.length === 0 ? (
                    <div className="flex justify-between items-center rounded-md border px-3 py-2 mx-4">
                      <span>{p.name}</span>
                      <Switch checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                    </div>
                  ) : (
                    // Children grid: 2 per row
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-3">
                      {children.map((c) => (
                        <div
                          key={c.id}
                          className="flex justify-between items-center rounded-md border px-3 py-2"
                        >
                          <span className="truncate pr-2">{c.name}</span>
                          <Switch
                            checked={selected.has(c.id)}
                            onChange={() => toggle(c.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Collapse.Panel>
              </Collapse>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button className="px-4 py-2 rounded-md border" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue text-white"
          onClick={() => {
            // TODO: POST/PUT { roleId, module_ids: Array.from(selected) }
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
