
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/hooks/useOrders";

interface OrderInfoProps {
  order: Order;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string, className: string }> = {
      draft: { text: "טיוטה", className: "bg-gray-100" },
      sent: { text: "נשלח", className: "bg-blue-100 text-blue-800" },
      confirmed: { text: "מאושר", className: "bg-green-100 text-green-800" },
      completed: { text: "הושלם", className: "bg-purple-100 text-purple-800" }
    };
    
    const statusInfo = statusMap[status] || { text: status, className: "bg-gray-100" };
    
    return (
      <span className={`px-2 py-1 rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };
  
  // Format number to Israeli format (with comma separators and 2 decimal places)
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "";
    return new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">פרטי הזמנה</h2>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground">מזהה:</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">לקוח:</p>
              <p className="font-medium">{order.client_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">תאריך:</p>
              <p className="font-medium">{new Date(order.date).toLocaleDateString("he-IL")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">סטטוס:</p>
              <p className="font-medium">{getStatusDisplay(order.status)}</p>
            </div>
            {order.service_topic && (
              <div>
                <p className="text-muted-foreground">נושא השירות / שם התוכנית:</p>
                <p className="font-medium">{order.service_topic}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">פרטים כספיים</h2>
          <div className="space-y-3">
            {order.hours !== undefined && (
              <div>
                <p className="text-muted-foreground">מספר שעות:</p>
                <p className="font-medium">{order.hours}</p>
              </div>
            )}
            {order.hourly_rate !== undefined && (
              <div>
                <p className="text-muted-foreground">תעריף לשעה:</p>
                <p className="font-medium">₪{formatCurrency(order.hourly_rate)}</p>
              </div>
            )}
            {order.total_amount !== undefined && (
              <div>
                <p className="text-muted-foreground">סכום כולל:</p>
                <p className="font-medium">₪{formatCurrency(order.total_amount)}</p>
              </div>
            )}
            {order.payment_terms && (
              <div>
                <p className="text-muted-foreground">תנאי תשלום:</p>
                <p className="font-medium">{order.payment_terms}</p>
              </div>
            )}
            {order.description && (
              <div>
                <p className="text-muted-foreground">תיאור:</p>
                <p className="font-medium">{order.description}</p>
              </div>
            )}
            {order.notes && (
              <div>
                <p className="text-muted-foreground">הערות:</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">נוצר בתאריך:</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString("he-IL")}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
