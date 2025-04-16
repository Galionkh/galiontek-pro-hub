
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewClientForm } from "@/features/clients/components/NewClientForm";
import { Client } from "@/features/clients/types";

interface ClientSelectorProps {
  clientId: string;
  clients: Client[];
  onClientSelect: (clientId: string) => void;
  isRequired?: boolean;
}

export function ClientSelector({ clientId, clients, onClientSelect, isRequired = false }: ClientSelectorProps) {
  const [isClientSheetOpen, setIsClientSheetOpen] = useState(false);

  const handleClientAdded = () => {
    setIsClientSheetOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="client_id">
        לקוח {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select 
          value={clientId} 
          onValueChange={onClientSelect}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="בחר לקוח" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Sheet open={isClientSheetOpen} onOpenChange={setIsClientSheetOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>הוספת לקוח חדש</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <NewClientForm onClientAdded={handleClientAdded} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
