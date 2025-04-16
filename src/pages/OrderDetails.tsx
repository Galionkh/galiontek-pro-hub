
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderInfo } from "@/components/orders/OrderInfo";
import { Separator } from "@/components/ui/separator";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { OrderDetailsSkeleton } from "@/components/orders/OrderDetailsSkeleton";
import { useOrderDetails } from "@/components/orders/useOrderDetails";

export default function OrderDetails() {
  const { id } = useParams();
  const {
    order,
    isLoading,
    fetchOrderDetails,
    deleteOrder,
    onDeleteConfirm,
    showDeleteDialog,
    setShowDeleteDialog,
  } = useOrderDetails(id);

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
              onDeleteClick={deleteOrder}
              onOrderUpdated={fetchOrderDetails}
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              onDeleteConfirm={onDeleteConfirm}
            />
            <Separator />
            <OrderInfo order={order} />
          </div>
        </Card>
      )}
    </div>
  );
}
