
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OrderCard } from "./OrderCard";
import type { Order } from "@/hooks/useOrders";
import { useOrders } from "@/hooks/useOrders";

interface OrdersListProps {
  orders: Order[];
  isLoadingOrders: boolean;
  onDeleteOrder: (id: number) => Promise<void>;
  onSendToClient: (id: number) => Promise<void>;
}

export const OrdersList = ({ 
  orders, 
  isLoadingOrders, 
  onDeleteOrder, 
  onSendToClient 
}: OrdersListProps) => {
  const { generateInvoiceNumber, cancelInvoice } = useOrders();

  if (isLoadingOrders) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">טוען הזמנות...</p>
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">אין הזמנות עדיין</h2>
          <p>לחץ על "טופס הזמנה חדש" כדי ליצור את ההזמנה הראשונה שלך</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4" dir="rtl">
      {orders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          onDelete={onDeleteOrder}
          onSendToClient={onSendToClient}
        />
      ))}
    </div>
  );
}
