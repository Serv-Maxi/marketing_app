"use client";

import React from "react";
import { modelsService, ModelRow } from "@/services/models";
import { Input } from "@/components/ui/input";
import CreateModelDialog from "@/app/admin/models/_components/create-model-dialog";
import { AdminTable, ColumnDef } from "../../../components/shared/admin-table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ModelsPage() {
  const [models, setModels] = React.useState<ModelRow[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const modelsData = await modelsService.list();
      setModels(modelsData);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await modelsService.update(id, { active: !currentStatus });
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update model status"
      );
      console.error("Failed to update model status:", error);
    }
  };

  const q = query.toLowerCase();
  const filtered = q
    ? models.filter(
        (model) =>
          model.name.toLowerCase().includes(q) ||
          model.code.toLowerCase().includes(q) ||
          model?.alt_code?.toLowerCase().includes(q) ||
          model.type.toLowerCase().includes(q)
      )
    : models;

  const columns: ColumnDef<ModelRow>[] = [
    {
      key: "_num",
      header: "No",
      cell: (_r, i) => <span className="text-muted-foreground">{i + 1}</span>,
      className: "w-12",
    },
    { key: "type", header: "Type" },
    { key: "code", header: "Code" },
    { key: "alt_code", header: "Alt Code" },
    { key: "name", header: "Name" },
    {
      key: "price",
      header: "Price",
      cell: (r) => `$${r.price.toFixed(2)}`,
    },
    {
      key: "metadata",
      header: "Metadata",
      cell: (r) =>
        r.metadata && Object.keys(r.metadata).length > 0 ? "✓" : "x",
    },
    {
      key: "active",
      header: "Active",
      cell: (r) => (
        <Switch
          checked={r?.active ?? false}
          onCheckedChange={() => handleToggleActive(r.id, r?.active ?? false)}
        />
      ),
    },
  ];

  return (
    <section className="p-4 rounded-xl container m-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Models</h2>
        <CreateModelDialog onSaved={refetch} />
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
        placeholder="Search models..."
        className="max-w-sm bg-white rounded-[12px]"
        onChange={(e) => onQuery(e.target.value)}
      />
    </div>
  );
}
