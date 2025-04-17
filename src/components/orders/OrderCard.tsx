
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Send, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Order } from "@/hooks/useOrders";
import { MeetingsTab } from "@/components/meetings/MeetingsTab";

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => Promise<void>;
  onSendToClient: (id: number) => Promise<void>;
}

// Function to get status badge color and text
const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return { className: "bg-yellow-200 text-yellow-800", text: "טיוטה" };
    case "sent":
      return { className: "bg-blue-200 text-blue-800", text: "נשלח" };
    case "confirmed":
      return { className: "bg-green-200 text-green-800", text: "מאושר" };
    case "completed":
      return { className: "bg-purple-200 text-purple-800", text: "הושלם" };
    default:
      return { className: "bg-gray-200 text-gray-800", text: status };
  }
};

export function OrderCard({ order, onDelete, onSendToClient }: OrderCardProps) {
  const navigate = useNavigate();
  const statusBadge = getStatusBadge(order.status);
  const [activeTab, setActiveTab] = useState<string>("info");
  
  // Format date if available
  const formattedDate = order.date ? new Date(order.date).toLocaleDateString('he-IL') : "לא צוין";
  
  // Handle view click - directly navigate to order details
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/orders/${order.id}`);
  };
  
  // Handle edit click - navigate to order details
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/orders/${order.id}`);
  };
  
  // Handle send to client
  const handleSendToClient = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onSendToClient(order.id);
  };

  // Handle delete click
  const handleDeleteClick = async () => {
    await onDelete(order.id);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md" dir="rtl">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{order.title}</h3>
            <p className="text-sm text-muted-foreground">{order.client_name || "ללא לקוח"}</p>
          </div>
          <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">מידע</TabsTrigger>
            <TabsTrigger value="meetings">מפגשים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="pt-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">תאריך:</span> {formattedDate}
              </div>
              <div>
                <span className="text-muted-foreground">סכום:</span> {order.total_amount ? `₪${order.total_amount}` : "לא צוין"}
              </div>
              {order.service_topic && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">נושא:</span> {order.service_topic}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="meetings" className="pt-2">
            <div className="max-h-[250px] overflow-y-auto">
              <MeetingsTab order={order} />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={handleViewClick}>
            <Eye className="h-4 w-4 ml-1" /> צפייה
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEditClick}>
            <Edit className="h-4 w-4 ml-1" /> עריכה
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSendToClient}
            disabled={order.status === "sent" || order.status === "confirmed" || order.status === "completed"}
          >
            <Send className="h-4 w-4 ml-1" /> שליחה
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 ml-1" /> מחיקה
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
                <AlertDialogDescription>
                  פעולה זו לא ניתנת לביטול. זה יסיר לצמיתות את ההזמנה וכל המידע הקשור אליה.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteClick} 
                  className="bg-destructive text-destructive-foreground"
                >
                  מחק
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
