"use client";
// Types

import React from "react";
import { adminUsersService } from "@/services/adminUsers";
import { Input } from "@/components/ui/input";
import CreateUserDialog, {
  EditUserInput,
} from "./_components/create-user-dialog";
import { AdminTable, ColumnDef } from "../../../components/shared/admin-table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteUserDialog from "./_components/delete-user-dialog";

export type UserMetadata = { roles?: string[]; companies?: string[] } | null;
export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  metadata: UserMetadata;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const usersRaw = await adminUsersService.list();
      const mapped = usersRaw.map(
        (u: {
          id: string;
          name: string | null;
          email: string;
          metadata?: { roles?: string[]; companies?: string[] } | null;
          created_at: string;
        }) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          metadata: (u.metadata as {
            roles?: string[];
            companies?: string[];
          } | null) ?? { roles: [], companies: [] },
          created_at: u.created_at,
        })
      );
      setUsers(mapped as AdminUser[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const q = query.toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    : users;

  const columns: ColumnDef<(typeof filtered)[number]>[] = [
    {
      key: "_num",
      header: "No",
      cell: (_r, i) => <span className="text-muted-foreground">{i + 1}</span>,
      className: "w-12",
    },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "roles",
      header: "Roles",
      cell: (r) => r.metadata?.roles?.join(", ") || "—",
    },
    {
      key: "companies",
      header: "Companies",
      cell: (r) => r.metadata?.companies?.join(", ") || "—",
    },
    {
      key: "actions",
      header: "",
      cell: (r) => <UserRowActions user={r} refetch={refetch} />,
      className: "text-right w-24",
    },
  ];

  return (
    <section className="p-4 rounded-xl container m-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Users</h2>
        <CreateUserDialog onSaved={refetch} />
      </div>
      <div className="pt-4 pb-8 flex justify-end">
        <Toolbar onQuery={setQuery} />
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

function Toolbar({ onQuery }: { onQuery: (q: string) => void }) {
  return (
    <div className="flex gap-2 items-center w-[300px]">
      <Input
        placeholder="Search users..."
        className="max-w-sm bg-white rounded-[12px]"
        onChange={(e) => onQuery(e.target.value)}
      />
    </div>
  );
}

// Row actions: edit/delete dialogs (skeletons)
function UserRowActions({
  user,
  refetch,
}: {
  user: EditUserInput;
  refetch: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <CreateUserDialog
        user={user}
        onSaved={refetch}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Edit user"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DeleteUserDialog userId={user.id} onDeleted={refetch} />
    </div>
  );
}
