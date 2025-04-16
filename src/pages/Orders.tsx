
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderForm } from "@/components/orders/OrderForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrders } from "@/hooks/useOrders";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Orders() {
  const { user } = useAuth();
  const { orders, isLoading, fetchOrders } = useOrders();
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleOrderAdded = () => {
    fetchOrders();
    setIsOrderSheetOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex justify-center items-center" dir="rtl">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות ופרויקטים</h1>
        <Sheet open={isOrderSheetOpen} onOpenChange={setIsOrderSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              הזמנה חדשה
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>הזמנה חדשה</SheetTitle>
            </SheetHeader>
            <OrderForm onOrderAdded={handleOrderAdded} />
          </SheetContent>
        </Sheet>
      </div>

      {orders.length === 0 ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <h2 className="text-xl font-semibold mb-2">אין הזמנות</h2>
            <p className="mb-6">הוסף הזמנה חדשה להתחיל לעקוב אחר הפרויקטים שלך</p>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  הזמנה חדשה
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>הזמנה חדשה</SheetTitle>
                </SheetHeader>
                <OrderForm onOrderAdded={handleOrderAdded} />
              </SheetContent>
            </Sheet>
          </div>
        </Card>
      ) : (
        <OrdersList orders={orders} onOrdersChanged={fetchOrders} />
      )}
    </div>
  );
}
