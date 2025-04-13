
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Client = {
  id: string;
  name: string;
  contact: string;
  status: "active" | "pending" | "closed";
  notes?: string;
};

// Sample data for clients
const clients: Client[] = [
  {
    id: "1",
    name: "אוניברסיטת תל אביב",
    contact: "דנה כהן, 050-1234567",
    status: "active",
    notes: "מעוניינים בסדרת הרצאות בנושא מנהיגות"
  },
  {
    id: "2",
    name: "חברת היי-טק בע״מ",
    contact: "יוסי לוי, 052-7654321",
    status: "pending",
    notes: "מחכה לאישור מהמנכ״ל"
  },
  {
    id: "3",
    name: "מכללת ספיר",
    contact: "רחל גולן, 054-9876543",
    status: "active"
  },
  {
    id: "4",
    name: "מסגרת הדרכות עמותת אור",
    contact: "אבי שלום, 053-6543210",
    status: "closed"
  }
];

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
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">לקוחות ומוסדות</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>לקוח חדש</span>
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חיפוש לקוחות..."
          className="pl-10 pr-10"
        />
      </div>
      
      <div className="grid gap-4">
        {clients.map(client => (
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
