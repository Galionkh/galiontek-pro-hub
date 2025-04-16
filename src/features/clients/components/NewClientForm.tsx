
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ClientFormDialog } from "./ClientFormDialog";
import { ClientFormField } from "./ClientFormField";
import { ClientStatusSelector } from "./ClientStatusSelector";

interface NewClientFormProps {
  onClientAdded: () => void;
}

export function NewClientForm({ onClientAdded }: NewClientFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "pending" | "closed">("active");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      console.log("Submitting client data with email:", email);
      const { error } = await supabase.from("clients").insert({
        name,
        contact,
        email: email || null, // Using null for empty email strings
        status,
        notes,
        user_id: user.id,
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({ title: "הלקוח נוסף בהצלחה" });
      setName("");
      setContact("");
      setEmail("");
      setStatus("active");
      setNotes("");
      setIsOpen(false);
      onClientAdded();
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({ 
        title: "שגיאה", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerButton = (
    <Button variant="default" className="flex items-center gap-2">
      <UserPlus className="h-4 w-4" />
      לקוח חדש
    </Button>
  );

  return (
    <ClientFormDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
      title="לקוח חדש"
      submitLabel="שמור לקוח"
      isLoading={loading}
      triggerButton={triggerButton}
    >
      <ClientFormField
        placeholder="שם הלקוח"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ClientFormField
        placeholder="פרטי קשר"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <ClientFormField
        placeholder="דואר אלקטרוני"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <ClientFormField
        placeholder="הערות"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <ClientStatusSelector
        status={status}
        onChange={(e) => setStatus(e.target.value as any)}
      />
    </ClientFormDialog>
  );
}
