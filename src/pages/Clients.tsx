
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

type Client = {
  id: string;
  name: string;
  contact: string;
  status: "active" | "pending" | "closed";
  notes?: string;
  created_at: string;
};

const getStatusColor = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "";
  }
};

const getStatusText = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "פעיל";
    case "pending":
      return "ממתין";
    case "closed":
      return "סגור";
    default:
      return "";
  }
};

export default function Clients() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error.message);
      toast({
        title: "שגיאה בטעינת לקוחות",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

  const createNewClient = async () => {
    if (!user) {
      toast({
        title: "יש להתחבר תחילה",
        description: "עליך להתחבר כדי ליצור לקוח חדש",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            name: "לקוח חדש",
            contact: "פרטי קשר חדשים",
            status: "pending",
            notes: "יש להשלים פרטים",
            user_id: user.id
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "נוצר בהצלחה",
        description: "הלקוח החדש נוצר בהצלחה",
      });

      // Refresh the clients list
      fetchClients();
    } catch (error: any) {
      console.error("Error creating client:", error.message);
      toast({
        title: "שגיאה ביצירת לקוח",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.notes && client.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={createNewClient}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>לקוח חדש</span>
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לקוחות..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoadingClients ? (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">טוען לקוחות...</p>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid gap-4">
          {filteredClients.map(client => (
            <Card key={client.id} className="card-hover">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{client.name}</CardTitle>
                <Badge className={getStatusColor(client.status)}>
                  {getStatusText(client.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-2"><strong>איש קשר:</strong> {client.contact}</p>
                {client.notes && (
                  <p className="text-muted-foreground text-sm">{client.notes}</p>
                )}
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    ערוך פרטים
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <UserPlus className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">אין לקוחות עדיין</h2>
            <p>לחץ על "לקוח חדש" כדי להוסיף את הלקוח הראשון שלך</p>
          </div>
        </Card>
      )}
    </div>
  );
}
