
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { Order } from "@/hooks/useOrders";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
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
        <div className="mt-4">
          <Button variant="outline" size="sm" className="mr-2">
            <FileText className="h-4 w-4 mr-1" />
            צפייה
          </Button>
          <Button variant="outline" size="sm">
            שלח ללקוח
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
