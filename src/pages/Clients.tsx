// src/pages/Clients.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, UserPlus, Loader2 } from "lucide-react";

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
  const { user } = useAuth();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [toEdit, setToEdit] = useState<Client | null>(null);

  // טוען את רשימת הלקוחות
  const fetchClients = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);

    if (error) {
      toast({ title: "שגיאה בטעינת לקוחות", description: error.message, variant: "destructive" });
    } else {
      setClients(data || []);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  // בודק אם יש להזמנות של לקוח
  const hasOrders = async (clientId: number): Promise<boolean> => {
    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("client_id", clientId);
    if (error) {
      console.error(error);
      return true; // במקרה של שגיאה נמנע מחיקה
    }
    return (count ?? 0) > 0;
  };

  // מחיקת לקוח עם בדיקה
  const handleDelete = async (c: Client) => {
    const linked = await hasOrders(c.id);
    if (linked) {
      toast({ title: "לא ניתן למחוק לקוח", description: "יש הזמנות קשורות.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`למחוק את "${c.name}"? פעולה לא ניתנת לביטול.`)) return;

    const { error } = await supabase.from("clients").delete().eq("id", c.id);
    if (error) {
      toast({ title: "שגיאה במחיקה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הלקוח נמחק בהצלחה" });
      fetchClients();
    }
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase()) ||
    (c.notes?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-6">
      {/* כותרת + כפתור הוספה */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>
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
              onSuccess={() => {
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* תצוגת רשימה */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="card-hover">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{c.name}</CardTitle>
                <Badge className={getStatusColor(c.status)}>
                  {getStatusText(c.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-2"><strong>איש קשר:</strong> {c.contact}</p>
                {c.notes && <p className="text-sm text-muted-foreground">{c.notes}</p>}

                <div className="mt-4 flex gap-2">
                  {/* עריכה */}
                  <Dialog
                    open={editOpen && toEdit?.id === c.id}
                    onOpenChange={(o) => {
                      setEditOpen(o);
                      if (!o) setToEdit(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToEdit(c)}
                      >
                        ערוך פרטים
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>עריכת לקוח</DialogTitle>
                      </DialogHeader>
                      {toEdit && (
                        <EditClientForm
                          client={toEdit}
                          onSuccess={() => {
                            fetchClients();
                            setEditOpen(false);
                            setToEdit(null);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* מחיקה */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(c)}
                  >
                    מחק לקוח
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
  onSuccess: () => void;
}

function NewClientForm({ user, onSuccess }: NewClientFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<Client["status"]>("active");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("clients")
      .insert({ name, contact, status, notes, user_id: user.id });
    setLoading(false);

    if (error) {
      toast({ title: "שגיאה בהוספת הלקוח", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הלקוח נוסף בהצלחה" });
      onSuccess();
      setName("");
      setContact("");
      setStatus("active");
      setNotes("");
    }
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <Input placeholder="שם הלקוח" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="פרטי קשר" value={contact} onChange={e => setContact(e.target.value)} />
        <Input placeholder="הערות" value={notes} onChange={e => setNotes(e.target.value)} />
        <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value as any)}>
          <option value="active">פעיל</option>
          <option value="pending">ממתין</option>
          <option value="closed">סגור</option>
        </select>
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "שומר..." : "שמור לקוח"}
        </Button>
      </DialogFooter>
    </>
  );
}

interface EditClientFormProps {
  client: Client;
  onSuccess: () => void;
}

function EditClientForm({ client, onSuccess }: EditClientFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(client.name);
  const [contact, setContact] = useState(client.contact);
  const [status, setStatus] = useState<Client["status"]>(client.status);
  const [notes, setNotes] = useState(client.notes || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("clients")
      .update({ name, contact, status, notes })
      .eq("id", client.id);
    setLoading(false);

    if (error) {
      toast({ title: "שגיאה בעדכון", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הלקוח עודכן בהצלחה" });
      onSuccess();
    }
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <Input placeholder="שם הלקוח" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="פרטי קשר" value={contact} onChange={e => setContact(e.target.value)} />
        <Input placeholder="הערות" value={notes} onChange={e => setNotes(e.target.value)} />
        <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value as any)}>
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
