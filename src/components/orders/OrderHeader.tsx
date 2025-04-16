
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Send } from "lucide-react";
import type { Order } from "@/hooks/useOrders";

interface OrderHeaderProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  onSendToClient: () => Promise<void>;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  order, 
  onEdit, 
  onDelete, 
  onSendToClient 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          חזרה
        </Button>
        <h1 className="text-3xl font-bold">{order.title}</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onSendToClient}
          disabled={order.status === "sent" || order.status === "confirmed" || order.status === "completed"}
        >
          <Send className="h-4 w-4 ml-1" />
          שלח ללקוח
        </Button>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 ml-1" />
          ערוך
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 ml-1" />
          מחק
        </Button>
      </div>
    </div>
  );
};
