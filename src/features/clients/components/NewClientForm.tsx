
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface NewClientFormProps {
  onClientAdded: () => void;
}

export function NewClientForm({ onClientAdded }: NewClientFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"active" | "pending" | "closed">("active");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("clients").insert({
        name,
        contact,
        status,
        notes,
        user_id: user.id,
      });

      if (error) throw error;

      toast({ title: "הלקוח נוסף בהצלחה" });
      setName("");
      setContact("");
      setStatus("active");
      setNotes("");
      setIsOpen(false);
      onClientAdded();
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
