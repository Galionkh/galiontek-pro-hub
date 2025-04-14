import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";


// טיפוס לקוח

type Client = {
  id: number;
  name: string;
  contact: string;
  status: string;
  notes?: string;
  created_at: string;
  user_id?: string;
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
      return "bg-gray-100 text-gray-800";
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
      return status;
  }
};

export default function Clients() {
  const { toast } = useToast();
  const { user } = useAuth();
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
        .eq("user_id", user?.id)
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

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.notes && client.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>
        <NewClientForm onClientAdded={fetchClients} />
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
          {filteredClients.map((client) => (
            <Card key={client.id} className="card-hover">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{client.name}</CardTitle>
                <Badge className={getStatusColor(client.status)}>
                  {getStatusText(client.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <strong>איש קשר:</strong> {client.contact}
                </p>
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

function NewClientForm({ onClientAdded }: { onClientAdded: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"active" | "pending" | "closed">("active");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("clients")
      .insert({
        name,
        contact,
        status,
        notes,
        user_id: user.id,
      })
      .select();

    console.log("Inserted client:", data);

    setLoading(false);

    if (error) {
      toast({ title: "שגיאה", description: error.message });
    } else {
      toast({ title: "הלקוח נוסף בהצלחה" });
      onClientAdded();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          לקוח חדש
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>לקוח חדש</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="שם הלקוח"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="פרטי קשר"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <Input
            placeholder="הערות"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <select
            className="w-full border rounded p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="active">פעיל</option>
            <option value="pending">ממתין</option>
            <option value="closed">סגור</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "שומר..." : "שמור לקוח"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

