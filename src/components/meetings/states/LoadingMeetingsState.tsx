
import React from "react";

export const LoadingMeetingsState: React.FC = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
    </div>
  );
};
