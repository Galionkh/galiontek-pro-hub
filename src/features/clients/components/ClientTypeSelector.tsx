
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClientTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientTypeSelector({ value, onChange }: ClientTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="client-type">סוג לקוח<span className="text-red-500">*</span></Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="client-type">
          <SelectValue placeholder="בחר סוג לקוח" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="educational">מוסד חינוכי</SelectItem>
          <SelectItem value="company">חברה</SelectItem>
          <SelectItem value="individual">לקוח פרטי</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
