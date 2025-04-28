
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Event } from "../types";
import { EventCard } from "./EventCard";

interface EventTabsProps {
  todayEvents: Event[];
  thisWeekEvents: Event[];
  thisMonthEvents: Event[];
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
}

export const EventTabs = ({
  todayEvents,
  thisWeekEvents,
  thisMonthEvents,
  onEventEdit,
  onEventDelete
}: EventTabsProps) => {
  return (
    <Tabs defaultValue="today">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="today">היום ({todayEvents.length})</TabsTrigger>
        <TabsTrigger value="week">השבוע ({thisWeekEvents.length})</TabsTrigger>
        <TabsTrigger value="month">החודש ({thisMonthEvents.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="today" className="mt-4">
        {todayEvents.length > 0 ? (
          <div className="space-y-3">
            {todayEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => onEventEdit(event)}
                onDelete={() => onEventDelete(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין אירועים להיום</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="week" className="mt-4">
        {thisWeekEvents.length > 0 ? (
          <div className="space-y-3">
            {thisWeekEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => onEventEdit(event)}
                onDelete={() => onEventDelete(event.id)}
                showDate
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין אירועים לשבוע הקרוב</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="month" className="mt-4">
        {thisMonthEvents.length > 0 ? (
          <div className="space-y-3">
            {thisMonthEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => onEventEdit(event)}
                onDelete={() => onEventDelete(event.id)}
                showDate
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין אירועים לחודש הקרוב</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
