
import React from "react";

export const EmptyMeetingsState: React.FC = () => {
  return (
    <div className="text-center p-8 text-muted-foreground">
      <p>אין מפגשים מתוכננים עדיין.</p>
      <p>השתמש בכפתור 'הוסף מפגש' כדי ליצור מפגש חדש.</p>
    </div>
  );
};
