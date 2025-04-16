
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderForm } from "@/components/orders/OrderForm";
import { OrderDetailsSkeleton } from "@/components/orders/OrderDetailsSkeleton";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderInfo } from "@/components/orders/OrderInfo";
import { MeetingsTab } from "@/components/meetings/MeetingsTab";
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

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="details">פרטי הזמנה</TabsTrigger>
          <TabsTrigger value="meetings">מפגשים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <OrderInfo order={order} />
        </TabsContent>
        
        <TabsContent value="meetings">
          <MeetingsTab order={order} />
        </TabsContent>
      </Tabs>

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
