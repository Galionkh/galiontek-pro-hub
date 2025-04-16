
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderForm } from "@/components/orders/OrderForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrders } from "@/hooks/useOrders";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export default function Orders() {
  const { user } = useAuth();
  const { orders, isLoading, fetchOrders, createOrder, deleteOrder, sendOrderToClient } = useOrders();
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleOrderFormSubmit = async (formData: any) => {
    await createOrder(formData);
    setIsOrderDialogOpen(false);
    fetchOrders();
  };

  const handleCloseForm = () => {
    setIsOrderDialogOpen(false);
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
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              הזמנה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>הזמנה חדשה</DialogTitle>
            </DialogHeader>
            <OrderForm 
              onClose={handleCloseForm} 
              onSubmit={handleOrderFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      {orders.length === 0 ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <h2 className="text-xl font-semibold mb-2">אין הזמנות</h2>
            <p className="mb-6">הוסף הזמנה חדשה להתחיל לעקוב אחר הפרויקטים שלך</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  הזמנה חדשה
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>הזמנה חדשה</DialogTitle>
                </DialogHeader>
                <OrderForm 
                  onClose={handleCloseForm} 
                  onSubmit={handleOrderFormSubmit} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      ) : (
        <OrdersList 
          orders={orders} 
          isLoadingOrders={isLoading} 
          onDeleteOrder={deleteOrder} 
          onSendToClient={sendOrderToClient}
        />
      )}
    </div>
  );
}
