
import React from "react";
import { Plus, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MeetingsHeaderProps {
  onAddMeeting: () => void;
  onFileInputClick: () => void;
  use45MinuteUnits: boolean;
  setUse45MinuteUnits: (value: boolean) => void;
}

export const MeetingsHeader: React.FC<MeetingsHeaderProps> = ({
  onAddMeeting,
  onFileInputClick,
  use45MinuteUnits,
  setUse45MinuteUnits,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h3 className="text-lg font-semibold">מפגשי שירות</h3>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center space-x-2 ml-4">
          <Switch
            id="use45MinuteUnits"
            checked={use45MinuteUnits}
            onCheckedChange={setUse45MinuteUnits}
          />
          <Label htmlFor="use45MinuteUnits" className="mr-2">חישוב לפי יחידות הוראה (45 דקות)</Label>
        </div>
        
        <Button variant="outline" size="sm" onClick={onFileInputClick}>
          <FileSpreadsheet className="h-4 w-4 ml-2" />
          ייבוא מאקסל
        </Button>
        
        <Button onClick={onAddMeeting}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף מפגש
        </Button>
      </div>
    </div>
  );
};
