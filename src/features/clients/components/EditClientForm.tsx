
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Client } from "../types";

interface EditClientFormProps {
  client: Client;
  onClientUpdated: () => void;
}

export function EditClientForm({ client, onClientUpdated }: EditClientFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(client.name);
  const [contact, setContact] = useState(client.contact);
  const [email, setEmail] = useState(client.email || "");
  const [status, setStatus] = useState<"active" | "pending" | "closed">(client.status as any);
  const [notes, setNotes] = useState(client.notes || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(client.name);
    setContact(client.contact);
    setEmail(client.email || "");
    setStatus(client.status as any);
    setNotes(client.notes || "");
  }, [client]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Create update data object without email if it's empty
      const updateData: any = {
        name,
        contact,
        status,
        notes,
      };
      
      // Only include email if it's not empty
      if (email) {
        updateData.email = email;
      }

      const { error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", client.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "הלקוח עודכן בהצלחה" });
      setIsOpen(false);
      onClientUpdated();
    } catch (error: any) {
      toast({ 
        title: "שגיאה", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          ערוך פרטים
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>עריכת לקוח</DialogTitle>
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
            placeholder="דואר אלקטרוני"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "מעדכן..." : "עדכן לקוח"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
