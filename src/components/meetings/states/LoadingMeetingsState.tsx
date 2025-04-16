
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingMeetingsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-48">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-muted-foreground">טוען מפגשים...</p>
    </div>
  );
};
