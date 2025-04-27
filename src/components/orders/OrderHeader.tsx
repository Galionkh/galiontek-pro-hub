
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Send, Trash2 } from "lucide-react";
import type { Order } from "@/hooks/useOrders";

interface OrderHeaderProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  onSendToClient: () => void;
  onGenerateInvoice: () => void;
  onCancelInvoice: () => void;
}

export function OrderHeader({ 
  order, 
  onEdit, 
  onDelete, 
  onSendToClient,
  onGenerateInvoice,
  onCancelInvoice
}: OrderHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{order.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {order.client_name && `לקוח: ${order.client_name}`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {order.status === 'draft' && (
          <Button variant="outline" size="sm" onClick={onSendToClient}>
            <Send className="h-4 w-4 ml-2" />
            שלח ללקוח
          </Button>
        )}

        {!order.invoice_issued && (
          <Button variant="outline" size="sm" onClick={onGenerateInvoice}>
            <FileText className="h-4 w-4 ml-2" />
            הנפק חשבונית
          </Button>
        )}

        {order.invoice_issued && order.payment_status !== 'cancelled' && (
          <Button variant="outline" size="sm" className="text-red-600" onClick={onCancelInvoice}>
            <FileText className="h-4 w-4 ml-2" />
            בטל חשבונית
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 ml-2" />
          ערוך
        </Button>

        <Button variant="outline" size="sm" className="text-red-600" onClick={onDelete}>
          <Trash2 className="h-4 w-4 ml-2" />
          מחק
        </Button>
      </div>
    </div>
  );
}
