
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectorProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function StatusSelector({ status, onStatusChange }: StatusSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">סטטוס</Label>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="בחר סטטוס" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">טיוטה</SelectItem>
          <SelectItem value="sent">נשלח</SelectItem>
          <SelectItem value="confirmed">מאושר</SelectItem>
          <SelectItem value="completed">הושלם</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
