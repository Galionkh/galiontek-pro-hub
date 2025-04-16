
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MeetingsTableHeaderProps {
  use45MinuteUnits: boolean;
}

export const MeetingsTableHeader: React.FC<MeetingsTableHeaderProps> = ({ 
  use45MinuteUnits 
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>תאריך</TableHead>
        <TableHead>יום</TableHead>
        <TableHead>שעות</TableHead>
        <TableHead>משך</TableHead>
        <TableHead>{use45MinuteUnits ? 'יחידות הוראה' : 'שעות אקדמיות'}</TableHead>
        <TableHead>נושא</TableHead>
        <TableHead className="w-[100px]">פעולות</TableHead>
      </TableRow>
    </TableHeader>
  );
};
