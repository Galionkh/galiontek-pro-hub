
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderForm } from "@/components/orders/OrderForm";
import { OrderDetailsSkeleton } from "@/components/orders/OrderDetailsSkeleton";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderInfo } from "@/components/orders/OrderInfo";
import { useOrderDetails } from "@/components/orders/useOrderDetails";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;
  
  const {
    order,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleSendToClient
  } = useOrderDetails(orderId);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return <OrderNotFound />;
  }

  return (
    <div className="animate-fade-in space-y-6" dir="rtl">
      <OrderHeader 
        order={order} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onSendToClient={handleSendToClient} 
      />

      <OrderInfo order={order} />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>עריכת הזמנה</DialogTitle>
          </DialogHeader>
          <OrderForm 
            onClose={() => setIsEditDialogOpen(false)} 
            onSubmit={handleUpdate}
            initialData={order}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
