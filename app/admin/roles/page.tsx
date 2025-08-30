"use client";
import React from "react";
import { adminRolesService } from "@/services/adminRoles";
import CreateRoleDialog from "./_components/role-create-dialog";
import { Input } from "@/components/ui/input";
import RoleRowActions from "./_components/role-row-actions";
import { AdminTable, ColumnDef } from "@/components/shared/admin-table";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(false);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await adminRolesService.list();
      setRoles(list);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const filtered = roles; // placeholder: could add search filtering later

  type RoleRow = { id: string; name: string };
  const columns: ColumnDef<RoleRow>[] = [
    {
      key: "_num",
      header: "No",
      cell: (_r, i) => <span className="text-muted-foreground">{i + 1}</span>,
      className: "w-12",
    },
    { key: "name", header: "Name" },
    {
      key: "actions",
      header: "",
      cell: (r) => <RoleRowActions role={r} onChanged={refetch} />,
      className: "text-right w-24",
    },
  ];
  return (
    <section className="p-4 rounded-xl container m-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Roles</h2>
        <CreateRoleDialog onCreated={refetch} />
      </div>
      <div className="pt-4 pb-8 flex justify-end">
        <form className="flex gap-2 items-center w-[300px]" method="GET">
          <Input
            name="q"
            placeholder="Search roles..."
            className="max-w-sm bg-white rounded-[12px]"
          />
        </form>
      </div>
      <div className="px-8 py-[50px] rounded-[24px] container m-auto bg-white">
        <AdminTable columns={columns} data={filtered} rowKey={(r) => r.id} />
        {loading && (
          <p className="text-xs text-muted-foreground mt-2">Refreshing...</p>
        )}
      </div>
    </section>
  );
}
