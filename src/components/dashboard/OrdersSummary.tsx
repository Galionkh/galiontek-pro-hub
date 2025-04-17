
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, CreditCard } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function OrdersSummary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, fetchOrders } = useOrders();
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'draft').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  
  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.total_amount || 0);
  }, 0);
  
  const handleNavigateToOrders = () => {
    navigate('/orders');
  };
  
  return (
    <Card className="card-hover cursor-pointer" onClick={handleNavigateToOrders}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>סיכום הזמנות</span>
          <FileText className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{totalOrders}</span>
            <span className="text-sm text-muted-foreground">סה"כ הזמנות</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{pendingOrders}</span>
            <span className="text-sm text-muted-foreground">הזמנות פתוחות</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{completedOrders}</span>
            <span className="text-sm text-muted-foreground">הזמנות שהושלמו</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <CreditCard className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat('he-IL', {
                  style: 'currency',
                  currency: 'ILS',
                  maximumFractionDigits: 0
                }).format(totalRevenue)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">סך הכנסות</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
