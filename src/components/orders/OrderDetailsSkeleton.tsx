
import React from "react";
import { Card } from "@/components/ui/card";

export const OrderDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in flex justify-center items-center h-[60vh]">
      <div className="text-center">
        <p className="text-muted-foreground">טוען פרטי הזמנה...</p>
      </div>
    </div>
  );
};
