
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalculatorIcon, ClockIcon, GraduationCapIcon } from "lucide-react";

interface MeetingsSummaryProps {
  totalMeetings: number;
  totalHours: number;
  totalTeachingUnits: number;
  agreedHours: number | null;
  use45MinuteUnits: boolean;
  isCompact?: boolean;
}

export const MeetingsSummary: React.FC<MeetingsSummaryProps> = ({
  totalMeetings,
  totalHours,
  totalTeachingUnits,
  agreedHours,
  use45MinuteUnits,
  isCompact = false
}) => {
  // חישוב אחוז ההתקדמות
  const progressPercentage = agreedHours ? Math.min(100, (totalHours / agreedHours) * 100) : 0;
  
  if (isCompact) {
    return (
      <div className="text-sm">
        <div className="flex justify-between mb-1">
          <span className="font-medium">התקדמות:</span>
          <span>{totalHours.toFixed(1)} / {agreedHours || '?'} שעות</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-2" />
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>מפגשים: {totalMeetings}</div>
          <div>יחידות הוראה: {totalTeachingUnits.toFixed(1)}</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CalculatorIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">מספר מפגשים</p>
              <p className="text-2xl font-bold">{totalMeetings}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <ClockIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">סה"כ שעות</p>
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <GraduationCapIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                יחידות הוראה {use45MinuteUnits ? "(45 דקות)" : "(60 דקות)"}
              </p>
              <p className="text-2xl font-bold">{totalTeachingUnits.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        {agreedHours && (
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">התקדמות ({totalHours.toFixed(1)} / {agreedHours} שעות)</span>
              <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
