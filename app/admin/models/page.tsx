"use client";

import React from "react";
import { modelsService, ModelRow, PaginationParams } from "@/services/models";
import CreateModelDialog from "@/app/admin/models/_components/create-model-dialog";
import { AdminTable, ColumnDef } from "../../../components/shared/admin-table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  PaginationControl,
  SearchToolbar,
} from "@/components/shared/pagination-control";

export default function ModelsPage() {
  const [models, setModels] = React.useState<ModelRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [totalItems, setTotalItems] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await modelsService.list(pagination);
      setModels(response.data);
      setTotalItems(response.total);
      setPageCount(response.pageCount);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(pageSize),
    }));
  };

  // Handle search input from toolbar
  const handleSearch = (searchQuery: string) => {
    setPagination((prev) => ({ ...prev, page: 1, search: searchQuery }));
  };

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

  // Columns definition
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
        <div className="w-[300px]">
          <SearchToolbar
            onSearch={handleSearch}
            placeholder="Search models..."
          />
        </div>
      </div>
      <div className="px-8 py-[50px] rounded-[24px] container m-auto bg-white">
        <AdminTable columns={columns} data={models} rowKey={(r) => r.id} />

        <PaginationControl
          currentPage={pagination.page}
          pageCount={pageCount}
          pageSize={pagination.pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={loading}
        />
      </div>
    </section>
  );
}
