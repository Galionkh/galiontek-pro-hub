
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export const OrderNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh]">
      <FileX className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">הזמנה לא נמצאה</h1>
      <p className="text-muted-foreground mb-6">ההזמנה המבוקשת אינה קיימת או שנמחקה</p>
      <Button onClick={() => navigate("/orders")}>חזרה לרשימת ההזמנות</Button>
    </div>
  );
};
