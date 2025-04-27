
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderInfo } from "@/components/orders/OrderInfo";
import { Separator } from "@/components/ui/separator";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { OrderDetailsSkeleton } from "@/components/orders/OrderDetailsSkeleton";
import { useOrderDetails } from "@/components/orders/useOrderDetails";
import { OrderForm } from "@/components/orders/OrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingsTab } from "@/components/meetings/MeetingsTab";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";

export default function OrderDetails() {
  const { id } = useParams();
  const orderId = parseInt(id || "0");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { generateInvoiceNumber, cancelInvoice } = useOrders();
  
  const {
    order,
    isLoading,
    handleUpdate,
    handleDelete,
    handleSendToClient,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEdit
  } = useOrderDetails(orderId);

  const onDeleteConfirm = async () => {
    await handleDelete();
    setShowDeleteDialog(false);
  };
  
  const handleGenerateInvoice = async () => {
    if (!order) return;
    
    try {
      await generateInvoiceNumber(order.id);
      toast({
        title: "החשבונית נוצרה",
        description: "החשבונית נוצרה בהצלחה"
      });
    } catch (error: any) {
      toast({
        title: "שגיאה ביצירת החשבונית",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCancelInvoice = async () => {
    if (!order) return;
    
    try {
      await cancelInvoice(order.id);
      toast({
        title: "החשבונית בוטלה",
        description: "החשבונית בוטלה בהצלחה"
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בביטול החשבונית",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {isLoading ? (
        <OrderDetailsSkeleton />
      ) : !order ? (
        <OrderNotFound />
      ) : (
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <OrderHeader
                order={order}
                onEdit={handleEdit}
                onDelete={() => setShowDeleteDialog(true)}
                onSendToClient={handleSendToClient}
                onGenerateInvoice={handleGenerateInvoice}
                onCancelInvoice={handleCancelInvoice}
              />
              <Separator />
              <OrderInfo order={order} />
            </div>
          </Card>

          <Tabs defaultValue="info" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">מידע</TabsTrigger>
              <TabsTrigger value="meetings">מפגשים</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="p-4 border rounded-md mt-2">
              <div className="prose max-w-none">
                <p className="text-muted-foreground">
                  {order.description || "אין תיאור להזמנה זו."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="meetings" className="p-4 border rounded-md mt-2">
              <MeetingsTab order={order} />
            </TabsContent>
          </Tabs>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl overflow-y-auto" dir="rtl">
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
        </>
      )}
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול. זה יסיר לצמיתות את ההזמנה וכל המידע הקשור אליה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-destructive text-destructive-foreground">
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
