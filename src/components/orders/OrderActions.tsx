
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Send, Ban } from "lucide-react";
import { Order } from "@/hooks/useOrders";
import { useState } from "react";
import { InvoiceDetailsDialog } from "@/components/invoices/InvoiceDetailsDialog";

interface OrderActionsProps {
  order: Order;
  onGenerateInvoice?: () => void;
  onCancelInvoice?: () => void;
  onSendInvoice?: () => void;
}

export function OrderActions({ 
  order, 
  onGenerateInvoice, 
  onCancelInvoice,
  onSendInvoice 
}: OrderActionsProps) {
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">פתח תפריט</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="rtl:flex rtl:flex-col"
        >
          <DropdownMenuItem 
            onClick={() => setShowInvoiceDetails(true)}
            disabled={!order.invoice_issued}
          >
            <FileText className="h-4 w-4 ml-2" />
            <span>הצג חשבונית</span>
          </DropdownMenuItem>
          
          {!order.invoice_issued && (
            <DropdownMenuItem onClick={onGenerateInvoice}>
              <FileText className="h-4 w-4 ml-2" />
              <span>הנפק חשבונית</span>
            </DropdownMenuItem>
          )}
          
          {order.invoice_issued && !order.payment_status?.includes('cancelled') && (
            <>
              <DropdownMenuItem onClick={onSendInvoice}>
                <Send className="h-4 w-4 ml-2" />
                <span>שלח חשבונית</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={onCancelInvoice}
                className="text-red-600"
              >
                <Ban className="h-4 w-4 ml-2" />
                <span>בטל חשבונית</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoiceDetailsDialog
        order={order}
        open={showInvoiceDetails}
        onOpenChange={setShowInvoiceDetails}
      />
    </>
  );
}
