
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/features/clients/types";

interface ClientSelectorProps {
  clientId: string;
  clients: Client[];
  onClientSelect: (value: string) => void;
  isRequired?: boolean;
  error?: string;
}

export function ClientSelector({ 
  clientId, 
  clients, 
  onClientSelect, 
  isRequired = false,
  error
}: ClientSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="client_id">
        לקוח {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <Select 
        value={clientId} 
        onValueChange={onClientSelect}
      >
        <SelectTrigger 
          id="client_id" 
          className={`w-full ${error ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder="בחר לקוח" />
        </SelectTrigger>
        <SelectContent>
          {clients.map(client => (
            <SelectItem 
              key={client.id} 
              value={client.id.toString()}
            >
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
