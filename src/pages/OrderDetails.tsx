
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderInfo } from "@/components/orders/OrderInfo";
import { Separator } from "@/components/ui/separator";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { OrderDetailsSkeleton } from "@/components/orders/OrderDetailsSkeleton";
import { useOrderDetails } from "@/components/orders/useOrderDetails";
import { useState as useStateImport } from "react";
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

export default function OrderDetails() {
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    order,
    isLoading,
    handleUpdate,
    handleDelete,
    handleSendToClient,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEdit
  } = useOrderDetails(parseInt(id || "0"));

  const onDeleteConfirm = async () => {
    await handleDelete();
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {isLoading ? (
        <OrderDetailsSkeleton />
      ) : !order ? (
        <OrderNotFound />
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            <OrderHeader
              order={order}
              onEdit={handleEdit}
              onDelete={() => setShowDeleteDialog(true)}
              onSendToClient={handleSendToClient}
            />
            <Separator />
            <OrderInfo order={order} />
          </div>
        </Card>
      )}
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
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
