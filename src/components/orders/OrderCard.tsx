
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Send, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Order } from "@/hooks/useOrders";

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => Promise<void>;
  onSendToClient: (id: number) => Promise<void>;
}

export const OrderCard = ({ order, onDelete, onSendToClient }: OrderCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const getStatusClass = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100";
      case "sent": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft": return "טיוטה";
      case "sent": return "נשלח";
      case "confirmed": return "מאושר";
      case "completed": return "הושלם";
      default: return status;
    }
  };

  const handleView = () => {
    navigate(`/orders/${order.id}`);
  };

  const handleEdit = () => {
    navigate(`/orders/edit/${order.id}`);
  };

  const handleSendToClient = async () => {
    try {
      setIsLoading(prev => ({ ...prev, send: true }));
      await onSendToClient(order.id);
      toast({
        title: "נשלח בהצלחה",
        description: `הטופס נשלח ללקוח ${order.client_name}`,
      });
    } catch (error) {
      console.error("Error sending order:", error);
      toast({
        title: "שגיאה בשליחה",
        description: "לא ניתן לשלוח את הטופס, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, send: false }));
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(prev => ({ ...prev, delete: true }));
      await onDelete(order.id);
      toast({
        title: "נמחק בהצלחה",
        description: "הטופס נמחק מהמערכת",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "שגיאה במחיקה",
        description: "לא ניתן למחוק את הטופס, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between">
          {order.title}
          <span className={`text-sm px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>לקוח:</strong> {order.client_name}</p>
        <p><strong>תאריך:</strong> {new Date(order.date).toLocaleDateString("he-IL")}</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleView}>
            <FileText className="h-4 w-4 mr-1" />
            צפייה
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            עריכה
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendToClient}
            disabled={isLoading.send}
          >
            <Send className="h-4 w-4 mr-1" />
            שלח ללקוח
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            disabled={isLoading.delete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            בטל הזמנה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
