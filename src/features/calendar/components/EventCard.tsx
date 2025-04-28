
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Bell, Pencil, Repeat, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  showDate?: boolean;
}

export const EventCard = ({ event, onEdit, onDelete, showDate }: EventCardProps) => {
  return (
    <div className="bg-accent/50 p-4 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            {event.is_recurring && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Repeat className="h-3 w-3" />
                חוזר
              </Badge>
            )}
            {event.reminder && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                תזכורת
              </Badge>
            )}
          </div>
          {showDate && (
            <p className="text-muted-foreground text-sm">
              {new Date(event.date).toLocaleDateString('he-IL', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          )}
          <p className="mt-1">{event.location}</p>
          {event.description && (
            <p className="mt-2 text-sm">{event.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-1" />
            ערוך
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4 mr-1" />
            מחק
          </Button>
        </div>
      </div>
    </div>
  );
};
