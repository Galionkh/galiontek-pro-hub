
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { OrdersList } from "@/components/orders/OrdersList";
import { useOrders } from "@/hooks/useOrders";

export default function Orders() {
  const { orders, isLoading, isLoadingOrders, fetchOrders, createNewOrderForm } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות והרשמות</h1>
        <Button 
          className="flex items-center gap-2" 
          onClick={createNewOrderForm}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>טופס הזמנה חדש</span>
        </Button>
      </div>
      
      <OrdersList orders={orders} isLoadingOrders={isLoadingOrders} />
    </div>
  );
}
