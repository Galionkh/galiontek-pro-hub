
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

// Define the Order type
type Order = {
  id: string;
  title: string;
  client_name: string;
  date: string;
  status: "draft" | "sent" | "confirmed" | "completed";
  created_at: string;
};

export default function Orders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch orders on component mount
  useState(() => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      toast({
        title: "שגיאה בטעינת ההזמנות",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const createNewOrderForm = async () => {
    if (!user) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר כדי ליצור טופס הזמנה חדש",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            title: "טופס הזמנה חדש",
            client_name: "לקוח חדש",
            date: new Date().toISOString().split("T")[0],
            status: "draft",
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "טופס ההזמנה החדש נוצר בהצלחה",
      });

      // Refresh the orders list
      fetchOrders();
    } catch (error: any) {
      console.error("Error creating order form:", error.message);
      toast({
        title: "שגיאה ביצירת טופס הזמנה",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות והרשמות</h1>
        <Button 
          className="flex items-center gap-2" 
          onClick={createNewOrderForm}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>טופס הזמנה חדש</span>
        </Button>
      </div>
      
      {isLoadingOrders ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">טוען הזמנות...</p>
          </div>
        </Card>
      ) : orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between">
                  {order.title}
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    order.status === "draft" ? "bg-gray-100" :
                    order.status === "sent" ? "bg-blue-100 text-blue-800" :
                    order.status === "confirmed" ? "bg-green-100 text-green-800" :
                    "bg-purple-100 text-purple-800"
                  }`}>
                    {order.status === "draft" ? "טיוטה" :
                     order.status === "sent" ? "נשלח" :
                     order.status === "confirmed" ? "מאושר" : "הושלם"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>לקוח:</strong> {order.client_name}</p>
                <p><strong>תאריך:</strong> {new Date(order.date).toLocaleDateString("he-IL")}</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="mr-2">
                    <FileText className="h-4 w-4 mr-1" />
                    צפייה
                  </Button>
                  <Button variant="outline" size="sm">
                    שלח ללקוח
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <h2 className="text-xl font-semibold mb-2">אין הזמנות עדיין</h2>
            <p>לחץ על "טופס הזמנה חדש" כדי ליצור את ההזמנה הראשונה שלך</p>
          </div>
        </Card>
      )}
    </div>
  );
}
