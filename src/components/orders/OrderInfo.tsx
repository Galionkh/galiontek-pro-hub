
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/hooks/useOrders";

interface OrderInfoProps {
  order: Order;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  // Helper function to translate status to Hebrew
  const getStatusInHebrew = (status: string) => {
    switch (status) {
      case "draft": return "טיוטה";
      case "sent": return "נשלח";
      case "confirmed": return "מאושר";
      case "completed": return "הושלם";
      default: return status;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "לא צוין";
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">פרטי הזמנה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">לקוח</p>
              <p className="font-medium">{order.client_name || "לא צוין"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">תאריך</p>
              <p className="font-medium">{order.date || "לא צוין"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">סטטוס</p>
              <p className="font-medium">{getStatusInHebrew(order.status)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">נושא השירות / שם התוכנית</p>
              <p className="font-medium">{order.service_topic || "לא צוין"}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">פרטי תמחור</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">מספר שעות</p>
              <p className="font-medium">{order.hours || "לא צוין"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">תעריף לשעה</p>
              <p className="font-medium">{order.hourly_rate ? formatCurrency(order.hourly_rate) : "לא צוין"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">סכום כולל</p>
              <p className="font-medium">{formatCurrency(order.total_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">תנאי תשלום</p>
              <p className="font-medium">{order.payment_terms || "לא צוין"}</p>
            </div>
          </div>
        </div>

        {order.description && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">תיאור</h3>
              <p className="whitespace-pre-wrap">{order.description}</p>
            </div>
          </>
        )}

        {order.notes && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">הערות</h3>
              <p className="whitespace-pre-wrap">{order.notes}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
