"use client";

import { useState } from "react";
import { useActivityLogs } from "@/hooks/useAdmin";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";

export default function AdminActivityLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs({ page });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-foreground">Activity Logs</h1>

      <ul className="flex flex-col gap-2">
        {data?.items.map((log) => (
          <li key={log.id} className="flex items-center justify-between border border-border p-3 text-sm">
            <div>
              <p className="text-foreground">{log.description}</p>
              <p className="text-muted">{log.user_name || "System"}</p>
            </div>
            <span className="text-xs text-muted">{formatDate(log.created_at)}</span>
          </li>
        ))}
      </ul>

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}
