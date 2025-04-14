// src/pages/Clients.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Client = {
  id: number;
  name: string;
  contact: string;
  status: "active" | "pending" | "closed";
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
  }
};

export default function Clients() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Client | null>(null);

  const fetchClients = async () => {
    if (!user?.id) return;
    setLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      toast({ title: "שגיאה בטעינת לקוחות", description: err.message, variant: "destructive" });
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>

        {/* הוספת לקוח */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> לקוח חדש
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>לקוח חדש</DialogTitle>
            </DialogHeader>
            <NewClientForm
              user={user}
              onClientAdded={() => {
                fetchClients();
                setAddOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* חיפוש */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לקוחות..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* רשימת לקוחות */}
      {loadingClients ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4">
          {filtered.map((client) => (
            <Card key={client.id} className="card-hover">
              <CardHeader className="flex justify-between items-center">
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
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                )}
                <div className="mt-4 flex gap-2">
                  {/* עריכת לקוח */}
                  <Dialog open={editOpen && current?.id === client.id} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">ערוך פרטים</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>עריכת לקוח</DialogTitle>
                      </DialogHeader>
                      {current && (
                        <EditClientForm
                          client={current}
                          onClientUpdated={() => {
                            fetchClients();
                            setEditOpen(false);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrent(client);
                      setEditOpen(true);
                    }}
                  >
                    ערוך פרטים
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">אין לקוחות להצגה</p>
      )}
    </div>
  );
}

interface NewClientFormProps {
  user: any;
  onClientAdded: () => void;
}

function NewClientForm({ user, onClientAdded }: NewClientFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"active"|"pending"|"closed">("active");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .insert({ name, contact, status, notes, user_id: user.id })
      .select();
    setLoading(false);
    if (error) {
      toast({ title: "שגיאה בהוספת הלקוח", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "הלקוח נוסף בהצלחה" });
    onClientAdded();
    setName(""); setContact(""); setStatus("active"); setNotes("");
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <Input placeholder="שם הלקוח" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="פרטי קשר" value={contact} onChange={e => setContact(e.target.value)} />
        <Input placeholder="הערות" value={notes} onChange={e => setNotes(e.target.value)} />
        <select
          className="w-full border rounded p-2"
          value={status}
          onChange={e => setStatus(e.target.value as any)}
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
    </>
  );
}

interface EditClientFormProps {
  client: Client;
  onClientUpdated: () => void;
}

function EditClientForm({ client, onClientUpdated }: EditClientFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(client.name);
  const [contact, setContact] = useState(client.contact);
  const [status, setStatus] = useState<Client["status"]>(client.status);
  const [notes, setNotes] = useState(client.notes || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .update({ name, contact, status, notes })
      .eq("id", client.id)
      .select();
    setLoading(false);
    if (error) {
      toast({ title: "שגיאה בעדכון הלקוח", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "הלקוח עודכן בהצלחה" });
    onClientUpdated();
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <Input placeholder="שם הלקוח" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="פרטי קשר" value={contact} onChange={e => setContact(e.target.value)} />
        <Input placeholder="הערות" value={notes} onChange={e => setNotes(e.target.value)} />
        <select
          className="w-full border rounded p-2"
          value={status}
          onChange={e => setStatus(e.target.value as any)}
        >
          <option value="active">פעיל</option>
          <option value="pending">ממתין</option>
          <option value="closed">סגור</option>
        </select>
      </div>
      <DialogFooter>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "מעדכן..." : "עדכן לקוח"}
        </Button>
      </DialogFooter>
    </>
  );
}
