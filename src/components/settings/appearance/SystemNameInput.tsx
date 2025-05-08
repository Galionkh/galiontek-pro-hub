
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SystemNameInputProps {
  systemName: string;
  isSaving: boolean;
  onSystemNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export function SystemNameInput({
  systemName,
  isSaving,
  onSystemNameChange,
  onSave
}: SystemNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="system-name">שם המערכת</Label>
      <div className="flex gap-2">
        <Input
          id="system-name"
          value={systemName}
          onChange={onSystemNameChange}
          placeholder="הזן שם למערכת"
          className="flex-1"
        />
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="h-4 w-4 ml-2" />
          {isSaving ? "שומר..." : "שמור"}
        </Button>
      </div>
    </div>
  );
}
