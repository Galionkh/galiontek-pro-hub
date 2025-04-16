
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OrderForm } from "@/components/orders/OrderForm";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Order } from "@/hooks/useOrders";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (error: any) {
        console.error("Error fetching order:", error.message);
        toast({
          title: "שגיאה בטעינת ההזמנה",
          description: error.message,
          variant: "destructive",
        });
        navigate("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, toast]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update(formData)
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setOrder(prev => prev ? { ...prev, ...formData } : null);
      
      toast({
        title: "עודכן בהצלחה",
        description: "ההזמנה עודכנה בהצלחה",
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating order:", error.message);
      toast({
        title: "שגיאה בעדכון ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?")) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "נמחק בהצלחה",
        description: "ההזמנה נמחקה בהצלחה",
      });
      
      navigate("/orders");
    } catch (error: any) {
      console.error("Error deleting order:", error.message);
      toast({
        title: "שגיאה במחיקת ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendToClient = async () => {
    try {
      // First, update the status to "sent"
      const { error } = await supabase
        .from("orders")
        .update({ status: "sent" })
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setOrder(prev => prev ? { ...prev, status: "sent" } : null);
      
      toast({
        title: "נשלח בהצלחה",
        description: "ההזמנה נשלחה ללקוח בהצלחה",
      });
    } catch (error: any) {
      console.error("Error sending order:", error.message);
      toast({
        title: "שגיאה בשליחת ההזמנה",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">טוען פרטי הזמנה...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">הזמנה לא נמצאה</h1>
          <Button onClick={() => navigate("/orders")}>חזרה לרשימת ההזמנות</Button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string, className: string }> = {
      draft: { text: "טיוטה", className: "bg-gray-100" },
      sent: { text: "נשלח", className: "bg-blue-100 text-blue-800" },
      confirmed: { text: "מאושר", className: "bg-green-100 text-green-800" },
      completed: { text: "הושלם", className: "bg-purple-100 text-purple-800" }
    };
    
    const statusInfo = statusMap[status] || { text: status, className: "bg-gray-100" };
    
    return (
      <span className={`px-2 py-1 rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="animate-fade-in space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            חזרה
          </Button>
          <h1 className="text-3xl font-bold">{order.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSendToClient}
            disabled={order.status === "sent" || order.status === "confirmed" || order.status === "completed"}
          >
            <Send className="h-4 w-4 ml-1" />
            שלח ללקוח
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 ml-1" />
            ערוך
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 ml-1" />
            מחק
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">פרטי הזמנה</h2>
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground">מזהה:</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">לקוח:</p>
                <p className="font-medium">{order.client_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">תאריך:</p>
                <p className="font-medium">{new Date(order.date).toLocaleDateString("he-IL")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">סטטוס:</p>
                <p className="font-medium">{getStatusDisplay(order.status)}</p>
              </div>
              {order.payment_terms && (
                <div>
                  <p className="text-muted-foreground">תנאי תשלום:</p>
                  <p className="font-medium">{order.payment_terms}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">פרטים נוספים</h2>
            <div className="space-y-3">
              {order.description && (
                <div>
                  <p className="text-muted-foreground">תיאור:</p>
                  <p className="font-medium">{order.description}</p>
                </div>
              )}
              {order.notes && (
                <div>
                  <p className="text-muted-foreground">הערות:</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">נוצר בתאריך:</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString("he-IL")}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
