
import React from "react";

interface ClientStatusSelectorProps {
  status: "active" | "pending" | "closed";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export function ClientStatusSelector({ status, onChange, className = "" }: ClientStatusSelectorProps) {
  return (
    <select
      className={`w-full border rounded p-2 ${className}`}
      value={status}
      onChange={onChange}
    >
      <option value="active">פעיל</option>
      <option value="pending">ממתין</option>
      <option value="closed">סגור</option>
    </select>
  );
}
