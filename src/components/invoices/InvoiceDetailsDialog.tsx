
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface InvoiceDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({ order, open, onOpenChange }: InvoiceDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'שולם';
      case 'overdue':
        return 'באיחור';
      case 'pending':
        return 'ממתין לתשלום';
      case 'cancelled':
        return 'בוטל';
      default:
        return 'לא ידוע';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>חשבונית מספר: {order.invoice_number || 'טרם הונפק'}</span>
              {order.payment_status && (
                <Badge variant="outline" className={getStatusColor(order.payment_status)}>
                  {getStatusText(order.payment_status)}
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">פרטי לקוח</h3>
              <p>{order.client_name}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">תאריכים</h3>
              <div className="space-y-1">
                {order.invoice_date && (
                  <p>תאריך הנפקה: {format(new Date(order.invoice_date), 'dd/MM/yyyy', { locale: he })}</p>
                )}
                {order.invoice_due_date && (
                  <p>לתשלום עד: {format(new Date(order.invoice_due_date), 'dd/MM/yyyy', { locale: he })}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">פרטי התשלום</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>סכום לפני מע"מ:</span>
                <span>{formatCurrency(order.total_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>מע"מ ({order.tax_rate}%):</span>
                <span>{formatCurrency((order.total_amount || 0) * (order.tax_rate || 0) / 100)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>סה"כ כולל מע"מ:</span>
                <span>
                  {formatCurrency((order.total_amount || 0) * (1 + (order.tax_rate || 0) / 100))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>הורד PDF</span>
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              <span>שלח ללקוח</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
