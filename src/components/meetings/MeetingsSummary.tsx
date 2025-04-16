
import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MeetingsSummaryProps {
  totalMeetings: number;
  totalHours: number;
  totalTeachingUnits: number;
  agreedHours?: number | null;
}

export const MeetingsSummary: React.FC<MeetingsSummaryProps> = ({
  totalMeetings,
  totalHours,
  totalTeachingUnits,
  agreedHours,
}) => {
  // Check if we have agreed hours and if we've reached them
  const showCompletion = 
    agreedHours !== undefined && 
    agreedHours !== null && 
    totalTeachingUnits > 0;
  
  const isCompleted = 
    showCompletion && 
    totalTeachingUnits >= agreedHours;
  
  const remainingHours = 
    showCompletion && !isCompleted
      ? (agreedHours - totalTeachingUnits).toFixed(2)
      : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center p-3 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">סך מפגשים</span>
            <span className="text-2xl font-bold">{totalMeetings}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">סך שעות בפועל</span>
            <span className="text-2xl font-bold">{totalHours}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">סך יחידות הוראה</span>
            <span className="text-2xl font-bold">{totalTeachingUnits.toFixed(2)}</span>
          </div>
        </div>
        
        {showCompletion && (
          <div className={cn(
            "flex items-center justify-center p-3 rounded-md",
            isCompleted ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          )}>
            {isCompleted ? (
              <>
                <CheckCircle className="h-5 w-5 ml-2" />
                <span className="font-medium">השירות הושלם בפועל</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 ml-2" />
                <span className="font-medium">נותרו {remainingHours} שעות לסיום השירות</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
