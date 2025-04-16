
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditClientForm } from "./EditClientForm";
import { Client } from "../types";
import { Edit, Archive, ArchiveRestore } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onArchive: (client: Client) => Promise<void>;
  onDelete?: (client: Client) => void;
  onRestore?: (client: Client) => Promise<void>;
  isArchived?: boolean;
  dir?: "ltr" | "rtl";
}

export function ClientCard({
  client,
  onEdit,
  onArchive,
  onDelete,
  onRestore,
  isArchived = false,
  dir = "ltr"
}: ClientCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">פעיל</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">ממתין</Badge>;
      case "closed":
        return <Badge variant="secondary">סגור</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between">
          {client.name}
          {getStatusBadge(client.status || "active")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {client.contact && (
          <p className="text-sm"><span className="font-medium">איש קשר:</span> {client.contact}</p>
        )}
        {client.notes && (
          <p className="text-sm"><span className="font-medium">הערות:</span> {client.notes}</p>
        )}
        
        <div className="flex flex-wrap gap-2 justify-end" dir={dir}>
          <EditClientForm client={client} onClientUpdated={onEdit} />
          
          {!isArchived ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onArchive(client)}
              className="flex items-center gap-1"
            >
              <Archive className="h-4 w-4" />
              <span>העבר לארכיון</span>
            </Button>
          ) : onRestore ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRestore(client)}
              className="flex items-center gap-1"
            >
              <ArchiveRestore className="h-4 w-4" />
              <span>שחזר לקוח</span>
            </Button>
          ) : null}
          
          {/* Only show delete button if onDelete is provided */}
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(client)}
              className="flex items-center gap-1"
            >
              <span>מחק</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
