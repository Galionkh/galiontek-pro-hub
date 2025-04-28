
import { Event } from "../types";
import { EventCard } from "./EventCard";

interface ListViewProps {
  groupedEvents: Record<string, Event[]>;
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
}

export const ListView = ({
  groupedEvents,
  onEventEdit,
  onEventDelete
}: ListViewProps) => {
  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([month, monthEvents]) => (
        <div key={month} className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">{month}</h2>
          <div className="space-y-3">
            {monthEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => onEventEdit(event)}
                onDelete={() => onEventDelete(event.id)}
                showDate
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
