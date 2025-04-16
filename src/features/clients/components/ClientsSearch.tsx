
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClientsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ClientsSearch({ searchQuery, onSearchChange }: ClientsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="חיפוש לקוחות..."
        className="pl-10 pr-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
