
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MeetingsTableHeaderProps {
  use45MinuteUnits: boolean;
  isCompact?: boolean;
}

export const MeetingsTableHeader: React.FC<MeetingsTableHeaderProps> = ({ 
  use45MinuteUnits,
  isCompact = false
}) => {
  if (isCompact) {
    return (
      <TableHeader>
        <TableRow>
          <TableHead>תאריך</TableHead>
          <TableHead>שעות</TableHead>
          <TableHead>נושא</TableHead>
          <TableHead className="text-left">פעולות</TableHead>
        </TableRow>
      </TableHeader>
    );
  }

  return (
    <TableHeader>
      <TableRow>
        <TableHead>תאריך</TableHead>
        <TableHead>שעת התחלה</TableHead>
        <TableHead>שעת סיום</TableHead>
        <TableHead>משך (דקות)</TableHead>
        <TableHead>יחידות הוראה {use45MinuteUnits ? "(45 דקות)" : "(60 דקות)"}</TableHead>
        <TableHead>נושא</TableHead>
        <TableHead className="text-left">פעולות</TableHead>
      </TableRow>
    </TableHeader>
  );
};
