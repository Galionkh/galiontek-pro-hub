
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { OrderActions } from "./OrderActions";
import type { Order } from "@/hooks/useOrders";

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => Promise<void>;
  onSendToClient: (id: number) => Promise<void>;
}

export function OrderCard({ order, onDelete, onSendToClient }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'draft': return 'טיוטה';
      case 'sent': return 'נשלח';
      case 'confirmed': return 'מאושר';
      case 'completed': return 'הושלם';
      default: return status;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{order.title}</h3>
              <Badge variant="outline" className={getStatusColor(order.status || 'draft')}>
                {formatStatus(order.status || 'draft')}
              </Badge>
              {order.invoice_issued && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  הונפקה חשבונית
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {order.client_name || 'לא צוין לקוח'}
            </p>
          </div>
          <OrderActions 
            order={order}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">תאריך</p>
            <p className="font-medium">
              {order.date ? format(new Date(order.date), 'dd/MM/yyyy', { locale: he }) : 'לא צוין'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">סכום</p>
            <p className="font-medium">
              {order.total_amount?.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS'
              }) || 'לא צוין'}
            </p>
          </div>
          {order.invoice_number && (
            <>
              <div>
                <p className="text-muted-foreground">מספר חשבונית</p>
                <p className="font-medium">{order.invoice_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">סטטוס תשלום</p>
                <p className="font-medium">
                  {order.payment_status === 'paid' ? 'שולם' : 
                   order.payment_status === 'pending' ? 'ממתין לתשלום' : 
                   order.payment_status === 'overdue' ? 'באיחור' : 
                   order.payment_status === 'cancelled' ? 'בוטל' : 'לא ידוע'}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
