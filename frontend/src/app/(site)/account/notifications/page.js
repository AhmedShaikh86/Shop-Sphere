"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications, useMarkAllNotificationsRead } from "@/hooks/useProfile";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(page);
  const markAllAsRead = useMarkAllNotificationsRead();

  if (isLoading) return <Spinner />;

  if (data?.items.length === 0) {
    return <EmptyState icon={Bell} title="No notifications" description="Updates about your orders and account will appear here." />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-foreground">Notifications</h2>
        {data?.unread_count > 0 && (
          <Button size="sm" variant="outline" onClick={() => markAllAsRead.mutate()}>
            Mark All as Read
          </Button>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {data?.items.map((notification) => (
          <li
            key={notification.id}
            className={cn("border border-border p-4 text-sm", !notification.read_at && "bg-surface-alt")}
          >
            <p className="text-foreground">{notification.data.title}</p>
            <p className="mt-1 text-muted">{notification.data.message}</p>
            <p className="mt-2 text-xs text-muted">{formatDate(notification.created_at)}</p>
          </li>
        ))}
      </ul>

      <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
    </div>
  );
}
