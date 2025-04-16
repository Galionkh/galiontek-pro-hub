
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ClientsSearch({ searchQuery, onSearchChange }: ClientsSearchProps) {
  return (
    <div className="relative mt-4" dir="rtl">
      <Search className="absolute left-auto right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="חיפוש לקוחות..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-4 pr-10 text-right"
      />
    </div>
  );
}
