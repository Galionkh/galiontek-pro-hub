
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const OrderNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">הזמנה לא נמצאה</h1>
        <Button onClick={() => navigate("/orders")}>חזרה לרשימת ההזמנות</Button>
      </div>
    </div>
  );
};
